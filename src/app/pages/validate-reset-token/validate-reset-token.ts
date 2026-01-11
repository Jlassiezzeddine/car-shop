import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { ZardCardComponent } from '@shared/components/ui/card/card.component';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-reset-password-token',
  imports: [RouterLink, ZardCardComponent, ZardButtonComponent],
  templateUrl: './validate-reset-token.html',
})
export class ValidateResetToken implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  errorMessage: string | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.errorMessage = 'No reset token provided. Please check your email link.';
      return;
    }

    // Validate the token
    this.authService.validateResetToken(token).subscribe({
      next: () => {
        // Token is valid, redirect to reset password page with token
        this.router.navigate(['/auth/reset-password'], { queryParams: { token } });
      },
      error: (error) => {
        // Token validation failed
        if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error?.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage =
            'Invalid or expired reset token. Please request a new password reset link.';
        }
        console.error('Token validation error:', error);
      },
    });
  }
}
