import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';
import { ZardIconComponent } from '@shared/components/ui/icon/icon.component';
import { ZardInputDirective } from '@shared/components/ui/input/input.directive';
import { IUser, IUserCreate, IUserUpdate } from '@shared/interfaces/user.interface';
import { UserService } from '@shared/services/user/user.service';

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

function nameValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const value = control.value as string;
  if (!/^[a-zA-Z\s]+$/.test(value)) {
    return { namePattern: true };
  }
  return null;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardIconComponent,
  ],
  templateUrl: './user-form.html',
})
export class UserForm {
  user = input<IUser | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private userService = inject(UserService);

  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  form = new FormGroup({
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
    role: new FormControl<'admin' | 'user'>('user', [Validators.required]),
    avatar: new FormControl<string>(''),
    emailVerified: new FormControl<boolean>(false),
    phoneVerified: new FormControl<boolean>(false),
    isActive: new FormControl<boolean>(true),
  });

  constructor() {
    // Reactively update form when user input changes
    effect(() => {
      const user = this.user();
      if (user) {
        this.isEditMode.set(true);
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          avatar: user.avatar || '',
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          isActive: user.isActive,
        });
        // Password is not required for edit mode
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
        this.errorMessage.set(null);
      } else {
        // Reset form when switching to add mode
        this.isEditMode.set(false);
        this.form.reset({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          role: 'user',
          avatar: '',
          emailVerified: false,
          phoneVerified: false,
          isActive: true,
        });
        // Password is required for new users
        this.form
          .get('password')
          ?.setValidators([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            passwordComplexityValidator,
          ]);
        this.form.get('password')?.updateValueAndValidity();
        this.errorMessage.set(null);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const formValue = this.form.value;
      const user = this.user();

      if (user) {
        // Update existing user
        const updateData: IUserUpdate = {
          firstName: formValue.firstName!,
          lastName: formValue.lastName!,
          email: formValue.email!,
          phone: formValue.phone || undefined,
          role: formValue.role!,
          avatar: formValue.avatar || undefined,
          emailVerified: formValue.emailVerified!,
          phoneVerified: formValue.phoneVerified!,
          isActive: formValue.isActive!,
        };

        this.userService.updateUser(user.id, updateData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.saved.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(
              error?.error?.message || 'Failed to update user. Please try again.',
            );
          },
        });
      } else {
        // Create new user
        const createData: IUserCreate = {
          firstName: formValue.firstName!,
          lastName: formValue.lastName!,
          email: formValue.email!,
          phone: formValue.phone || undefined,
          password: formValue.password!,
          role: formValue.role!,
          avatar: formValue.avatar || undefined,
        };

        this.userService.addUser(createData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.saved.emit();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(
              error?.error?.message || 'Failed to create user. Please try again.',
            );
          },
        });
      }
    } else {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors?.['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors?.['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors?.['passwordComplexity']) {
        return 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&-)';
      }
      if (control.errors?.['namePattern']) {
        return 'Name can only contain letters and spaces';
      }
    }
    return null;
  }
}
