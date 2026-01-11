import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // authGuard already ensures authentication, so we only need to check admin role
  // Use shareReplay to cache the result and avoid multiple calls
  return authService.getCurrentUser().pipe(
    map((user) => {
      console.log('User:', user);
      if (user && user.role === 'admin') {
        return true;
      } else {
        // Redirect to home if not admin
        console.log('Not admin, redirecting to home');
        return router.createUrlTree(['/']);
      }
    }),
    catchError(() => {
      // On error, redirect to home
      return of(router.createUrlTree(['/']));
    }),
    shareReplay(1),
  );
};
