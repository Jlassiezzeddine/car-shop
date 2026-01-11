// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from '../shared/services/cookies/cookies.service';
import { IUser } from '../shared/interfaces/user.interface';
import { IAuthMeResponseDto, IUserDto } from './dto/user.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  private apiURL = `${environment.apiUrl}/auth`;

  login(
    credentials: { email: string; password: string },
    returnUrl?: string,
    rememberMe?: boolean,
  ): Observable<void> {
    // Backend sets HttpOnly cookie via Set-Cookie header
    // Backend handles token refresh automatically
    // withCredentials is handled by authInterceptor
    return this.http.post<void>(`${this.apiURL}/login`, { ...credentials, rememberMe }).pipe(
      map(() => {
        // Clear user cache to ensure fresh user data is fetched after login
        this.clearUserCache();
        // Store rememberMe flag in localStorage if enabled
        if (rememberMe) {
          this.saveRememberMeFlag(true);
        } else {
          this.clearRememberMeFlag();
        }
        // Navigate to returnUrl if provided and valid, otherwise go to home
        const redirectUrl = returnUrl && this.isValidReturnUrl(returnUrl) ? returnUrl : '/';
        this.router.navigateByUrl(redirectUrl);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      }),
    );
  }

  private isValidReturnUrl(url: string): boolean {
    // Only allow internal routes (starting with /)
    // Prevent external URLs and protocol-relative URLs
    return url.startsWith('/') && !url.startsWith('//');
  }

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  private getAuthMe(): Observable<IAuthMeResponseDto | null> {
    // Use switchMap with refreshTrigger to ensure fresh data when cache is cleared
    return this.refreshTrigger$.pipe(
      switchMap(() =>
        this.http.get<IAuthMeResponseDto>(`${this.apiURL}/me`).pipe(
          catchError(() => of(null)),
          shareReplay(1),
        ),
      ),
    );
  }

  /**
   * Convert backend UserDto to application IUser interface
   */
  private mapUserDtoToUser(dto: IUserDto): IUser {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone || undefined,
      emailVerified: dto.emailVerified,
      phoneVerified: dto.phoneVerified,
      role: dto.role,
      isActive: dto.isActive,
      avatar: dto.avatar || undefined,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      deletedAt: undefined,
    };
  }

  isAuthenticated(): Observable<boolean> {
    // Check authentication status by calling backend /auth/me endpoint
    // Backend validates HttpOnly cookie and handles token refresh automatically
    return this.getAuthMe().pipe(
      map((response) => response !== null && response.statusCode === 200 && !!response.data),
    );
  }

  getCurrentUser(): Observable<IUser | null> {
    // Get current user from cached /auth/me response and map to application interface
    return this.getAuthMe().pipe(
      map((response) => {
        if (response && response.statusCode === 200 && response.data) {
          return this.mapUserDtoToUser(response.data);
        }
        return null;
      }),
    );
  }

  // Clear cache when user logs out or logs in
  clearUserCache(): void {
    // Trigger a refresh by emitting a new value
    this.refreshTrigger$.next();
  }

  isAdmin(): Observable<boolean> {
    // Check if current user has admin role
    return this.getCurrentUser().pipe(
      map((user) => user !== null && user.role === 'admin'),
      catchError(() => of(false)),
    );
  }

  logout(): void {
    // Remove access and refresh token cookies (non-HttpOnly cookies)
    this.clearTokenCookies();
    // Clear user cache
    this.clearUserCache();
    // Clear rememberMe flag
    this.clearRememberMeFlag();

    // Call backend logout endpoint to clear HttpOnly cookies
    this.http.post(`${this.apiURL}/logout`, {}).subscribe({
      next: () => {
        // Backend clears the HttpOnly cookies
        // Navigate to login page
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Even if logout fails, ensure cookies are cleared
        this.clearTokenCookies();
        // Clear user cache
        this.clearUserCache();
        // Clear rememberMe flag
        this.clearRememberMeFlag();
        // Navigate to login page
        this.router.navigate(['/auth/login']);
      },
    });
  }

  private clearTokenCookies(): void {
    // Delete access token cookies with common variations
    const accessTokenNames = [
      'access_token',
      'access-token',
      'accessToken',
      'auth_token',
      'auth-token',
      'authToken',
    ];

    // Delete refresh token cookies with common variations
    const refreshTokenNames = ['refresh_token', 'refresh-token', 'refreshToken'];

    // Delete all variations
    [...accessTokenNames, ...refreshTokenNames].forEach((name) => {
      this.cookieService.set(name, '', new Date(0));
    });
  }

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Observable<void> {
    // Transform email to lowercase and trim (backend also does this, but doing it here for consistency)
    const payload = {
      ...data,
      email: data.email.toLowerCase().trim(),
    };

    return this.http.post<void>(`${this.apiURL}/register`, payload).pipe(
      map(() => {
        // Navigate to login page after successful registration
        this.router.navigate(['/auth/login']);
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        throw error;
      }),
    );
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiURL}/request-password-reset`, { email }).pipe(
      catchError((error) => {
        console.error('Password reset request failed:', error);
        throw error;
      }),
    );
  }

  validateResetToken(resetToken: string): Observable<void> {
    return this.http.post<void>(`${this.apiURL}/validate-reset-token`, { resetToken }).pipe(
      catchError((error) => {
        console.error('Token validation failed:', error);
        throw error;
      }),
    );
  }

  resetPassword(data: {
    resetToken: string;
    password: string;
    confirmPassword: string;
  }): Observable<void> {
    return this.http
      .post<void>(`${this.apiURL}/reset-password`, {
        resetToken: data.resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      .pipe(
        map(() => {
          // Navigate to login page after successful password reset
          this.router.navigate(['/auth/login']);
        }),
        catchError((error) => {
          console.error('Password reset failed:', error);
          throw error;
        }),
      );
  }

  verifyOTP(data: { email: string; otp: string }): Observable<{
    statusCode: number;
    message: string;
    timestamp: string;
    data: {
      message: string;
      success: boolean;
      resetToken: string;
      expiresAt: string;
    };
  }> {
    return this.http
      .post<{
        statusCode: number;
        message: string;
        timestamp: string;
        data: {
          message: string;
          success: boolean;
          resetToken: string;
          expiresAt: string;
        };
      }>(`${this.apiURL}/verify-otp`, data)
      .pipe(
        map((response) => {
          // Navigate to reset-password page with the resetToken from response body
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { resetToken: response.data.resetToken },
          });
          return response;
        }),
        catchError((error) => {
          console.error('OTP verification failed:', error);
          throw error;
        }),
      );
  }

  /**
   * Get the rememberMe flag from localStorage
   * @returns true if rememberMe is enabled, false otherwise
   */
  getRememberMeFlag(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const flag = localStorage.getItem('rememberMe');
      return flag === 'true';
    } catch (error) {
      console.error('Error retrieving rememberMe flag:', error);
      return false;
    }
  }

  /**
   * Save the rememberMe flag to localStorage
   * @param rememberMe - boolean flag to save
   */
  private saveRememberMeFlag(rememberMe: boolean): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem('rememberMe', rememberMe.toString());
    } catch (error) {
      console.error('Error saving rememberMe flag:', error);
    }
  }

  /**
   * Clear the rememberMe flag from localStorage
   */
  private clearRememberMeFlag(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Error clearing rememberMe flag:', error);
    }
  }
}
