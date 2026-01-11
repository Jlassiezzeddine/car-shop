import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ZardInputDirective } from '@shared/components/ui/input/input.directive';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';
import { ZardCardComponent } from '@shared/components/ui/card/card.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardCardComponent,
    RouterLink,
  ],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
    rememberMe: new FormControl<boolean>(false),
  });

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // Check if rememberMe flag is set
    const rememberMe = this.authService.getRememberMeFlag();
    if (rememberMe) {
      // Set the checkbox to checked
      this.form.patchValue({ rememberMe: true });

      // Check if user is already authenticated via server cookie
      this.authService
        .isAuthenticated()
        .pipe(first())
        .subscribe({
          next: (isAuthenticated) => {
            if (isAuthenticated) {
              // User is authenticated via cookie, redirect to returnUrl or home
              const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
              const redirectUrl = returnUrl && this.isValidReturnUrl(returnUrl) ? returnUrl : '/';
              this.router.navigateByUrl(redirectUrl);
            }
          },
          error: () => {
            // If check fails, user is not authenticated, stay on login page
          },
        });
    }
  }

  private isValidReturnUrl(url: string): boolean {
    // Only allow internal routes (starting with /)
    // Prevent external URLs and protocol-relative URLs
    return url.startsWith('/') && !url.startsWith('//');
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
      const rememberMe = this.form.value.rememberMe ?? false;

      this.authService
        .login(
          { email: this.form.value.email!, password: this.form.value.password! },
          returnUrl,
          rememberMe,
        )
        .subscribe({
          next: () => {
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            // Extract error message from response
            if (error?.error?.message) {
              this.errorMessage = error.error.message;
            } else if (error?.message) {
              this.errorMessage = error.message;
            } else {
              this.errorMessage = 'Login failed. Please check your credentials and try again.';
            }
            console.error('Login error:', error);
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }
}
