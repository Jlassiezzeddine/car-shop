import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  // Include hyphen as special character - escape it or place at start/end of character class
  const hasSpecialChar = /[-@$!%*?&]/.test(value);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return { passwordComplexity: true };
  }
  return null;
}

function nameValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const value = control.value as string;
  // Only letters and spaces allowed
  if (!/^[a-zA-Z\s]+$/.test(value)) {
    return { namePattern: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    ZardInputDirective,
    ZardButtonComponent,
    RouterLink,
    ZardIconComponent,
    ZardCardComponent,
  ],
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);

  showPassword = false;
  showConfirmPassword = false;

  form = new FormGroup(
    {
      firstName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ]),
      lastName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ]),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      phone: new FormControl<string>(''),
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

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const formValue = this.form.value;
      this.authService
        .register({
          firstName: formValue.firstName!,
          lastName: formValue.lastName!,
          email: formValue.email!,
          password: formValue.password!,
          phone: formValue.phone || undefined,
        })
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.successMessage = 'Registration successful! Redirecting to login...';
            // Redirect will be handled by AuthService
          },
          error: (error) => {
            this.isLoading = false;
            // Extract error message from response
            if (error?.error?.message) {
              this.errorMessage = error.error.message;
            } else if (error?.message) {
              this.errorMessage = error.message;
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
            console.error('Registration error:', error);
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

  getFirstNameError(): string | null {
    const control = this.form.get('firstName');
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) {
        return 'First name is required';
      }
      if (control.errors?.['minlength']) {
        return 'First name must be at least 2 characters long';
      }
      if (control.errors?.['maxlength']) {
        return 'First name must not exceed 50 characters';
      }
      if (control.errors?.['namePattern']) {
        return 'First name can only contain letters and spaces';
      }
    }
    return null;
  }

  getLastNameError(): string | null {
    const control = this.form.get('lastName');
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) {
        return 'Last name is required';
      }
      if (control.errors?.['minlength']) {
        return 'Last name must be at least 2 characters long';
      }
      if (control.errors?.['maxlength']) {
        return 'Last name must not exceed 50 characters';
      }
      if (control.errors?.['namePattern']) {
        return 'Last name can only contain letters and spaces';
      }
    }
    return null;
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
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&-)';
      }
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
