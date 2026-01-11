import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ZardInputDirective } from '@shared/components/ui/input/input.directive';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';
import { ZardIconComponent } from '@shared/components/ui/icon/icon.component';
import { ZardCardComponent } from '@shared/components/ui/card/card.component';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const value = control.value as string;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[-@$!%*?&]/.test(value);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return { passwordComplexity: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    ZardInputDirective,
    ZardButtonComponent,
    RouterLink,
    ZardIconComponent,
    ZardCardComponent,
  ],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new FormGroup(
    {
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        passwordComplexityValidator,
      ]),
      confirmPassword: new FormControl<string>('', [Validators.required]),
    },
    { validators: passwordMatchValidator },
  );

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  resetToken: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  ngOnInit(): void {
    // Support both 'resetToken' (from OTP verification) and 'token' (from email link) for backward compatibility
    this.resetToken =
      this.route.snapshot.queryParams['resetToken'] || this.route.snapshot.queryParams['token'];

    if (!this.resetToken) {
      this.errorMessage = 'No reset token provided. Please check your email link.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (!this.resetToken) {
      this.errorMessage = 'No reset token provided. Please check your email link.';
      return;
    }

    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const formValue = this.form.value;
      this.authService
        .resetPassword({
          resetToken: this.resetToken,
          password: formValue.password!,
          confirmPassword: formValue.confirmPassword!,
        })
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.successMessage = 'Password reset successful! Redirecting to login...';
            // Redirect to login after a short delay
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          },
          error: (error) => {
            this.isLoading = false;
            // Extract error message from response
            if (error?.error?.message) {
              this.errorMessage = error.error.message;
            } else if (error?.message) {
              this.errorMessage = error.message;
            } else {
              this.errorMessage =
                'Password reset failed. Please try again or request a new reset link.';
            }
            console.error('Password reset error:', error);
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  getPasswordMismatchError(): boolean {
    return (
      this.form.hasError('passwordMismatch') &&
      this.form.get('confirmPassword')?.touched === true &&
      this.form.get('password')?.touched === true
    );
  }

  getPasswordError(): string | null {
    const control = this.form.get('password');
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) {
        return 'Password is required';
      }
      if (control.errors?.['minlength']) {
        return 'Password must be at least 8 characters long';
      }
      if (control.errors?.['maxlength']) {
        return 'Password must not exceed 128 characters';
      }
      if (control.errors?.['passwordComplexity']) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (-@$!%*?&)';
      }
    }
    return null;
  }
}
