import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';
import { ZardCardComponent } from '@shared/components/ui/card/card.component';
import { ZardInputDirective } from '@shared/components/ui/input/input.directive';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-password-reset-request',
  imports: [
    ReactiveFormsModule,
    ZardInputDirective,
    ZardButtonComponent,
    RouterLink,
    ZardCardComponent,
  ],
  templateUrl: './password-reset-request.html',
})
export class PasswordResetRequest implements OnInit, AfterViewInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  emailForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  otpForm = new FormGroup({
    otp0: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp1: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp2: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp3: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp4: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp5: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d$/)]),
  });

  isLoading = false;
  isVerifyingOTP = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  otpErrorMessage: string | null = null;
  showEmailForm = true;
  showOTPForm = false;
  userEmail: string | null = null;

  ngOnInit(): void {
    // Check if email is in query params (from previous form submission)
    const emailFromParams = this.route.snapshot.queryParams['email'];
    if (emailFromParams) {
      this.userEmail = emailFromParams;
      this.emailForm.patchValue({ email: emailFromParams });
      // If email is in params, show OTP form directly
      this.showEmailForm = false;
      this.showOTPForm = true;
    }
  }

  ngAfterViewInit(): void {
    // Focus first OTP input when OTP form is shown
    if (this.showOTPForm) {
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0') as HTMLInputElement;
        firstInput?.focus();
      }, 100);
    }
  }

  onSubmitEmail() {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      this.userEmail = this.emailForm.value.email!;

      this.authService.requestPasswordReset(this.userEmail).subscribe({
        next: () => {
          this.isLoading = false;
          // Always show success message without revealing if email exists (security best practice)
          this.successMessage =
            'If an account with that email exists, a password reset link has been sent. Please check your email.';

          // Store email in query params
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { email: this.userEmail },
            queryParamsHandling: 'merge',
          });

          this.showEmailForm = false;
          this.showOTPForm = true;
          this.successMessage = null;
          // Focus first OTP input
          setTimeout(() => {
            const firstInput = document.getElementById('otp-0') as HTMLInputElement;
            firstInput?.focus();
          }, 100);
        },
        error: (error) => {
          this.isLoading = false;
          // Still show success message for security (don't reveal if email exists)
          // But log the error for debugging
          this.successMessage =
            'If an account with that email exists, a password reset link has been sent. Please check your email.';
          console.error('Password reset request error:', error);

          // Store email in query params even on error
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { email: this.userEmail },
            queryParamsHandling: 'merge',
          });

          this.showEmailForm = false;
          this.showOTPForm = true;
          this.successMessage = null;
          // Focus first OTP input
          setTimeout(() => {
            const firstInput = document.getElementById('otp-0') as HTMLInputElement;
            firstInput?.focus();
          }, 100);
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.emailForm.controls).forEach((key) => {
        this.emailForm.get(key)?.markAsTouched();
      });
    }
  }

  getOTPValue(): string {
    return [
      this.otpForm.get('otp0')?.value || '',
      this.otpForm.get('otp1')?.value || '',
      this.otpForm.get('otp2')?.value || '',
      this.otpForm.get('otp3')?.value || '',
      this.otpForm.get('otp4')?.value || '',
      this.otpForm.get('otp5')?.value || '',
    ].join('');
  }

  onSubmitOTP() {
    if (!this.userEmail) {
      this.otpErrorMessage = 'Email is required. Please go back and enter your email.';
      return;
    }

    if (this.otpForm.valid) {
      this.isVerifyingOTP = true;
      this.otpErrorMessage = null;

      const otpValue = this.getOTPValue();

      this.authService
        .verifyOTP({
          email: this.userEmail,
          otp: otpValue,
        })
        .subscribe({
          next: () => {
            this.isVerifyingOTP = false;
            // OTP verified successfully - redirect will be handled by AuthService
          },
          error: (error) => {
            this.isVerifyingOTP = false;
            // Extract error message from response
            if (error?.error?.message) {
              this.otpErrorMessage = error.error.message;
            } else if (error?.message) {
              this.otpErrorMessage = error.message;
            } else {
              this.otpErrorMessage = 'Invalid OTP. Please try again.';
            }
            console.error('OTP verification error:', error);
            // Clear OTP inputs on error
            this.clearOTP();
          },
        });
    } else {
      // Mark all OTP fields as touched to show validation errors
      Object.keys(this.otpForm.controls).forEach((key) => {
        this.otpForm.get(key)?.markAsTouched();
      });
    }
  }

  clearOTP(): void {
    this.otpForm.patchValue({
      otp0: '',
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
    });
    // Focus first input
    setTimeout(() => {
      const firstInput = document.getElementById('otp-0') as HTMLInputElement;
      firstInput?.focus();
    }, 0);
  }

  onOTPKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const otpKeys: (keyof typeof this.otpForm.controls)[] = [
      'otp0',
      'otp1',
      'otp2',
      'otp3',
      'otp4',
      'otp5',
    ];

    // Allow common keyboard shortcuts (Ctrl/Cmd + key)
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    if (isCtrlOrCmd) {
      // Allow Ctrl+V (paste), Ctrl+C (copy), Ctrl+A (select all), Ctrl+X (cut)
      if (['v', 'V', 'c', 'C', 'a', 'A', 'x', 'X'].includes(key)) {
        return; // Let the browser handle these shortcuts
      }
    }

    // Handle backspace
    if (key === 'Backspace') {
      if (input.value === '' && index > 0) {
        // Move to previous input and clear it
        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        prevInput?.focus();
        this.otpForm.get(otpKeys[index - 1])?.setValue('');
      } else {
        // Clear current input
        this.otpForm.get(otpKeys[index])?.setValue('');
      }
      event.preventDefault();
      return;
    }

    // Handle delete
    if (key === 'Delete') {
      this.otpForm.get(otpKeys[index])?.setValue('');
      event.preventDefault();
      return;
    }

    // Handle arrow keys
    if (key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
      event.preventDefault();
      return;
    }

    if (key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
      event.preventDefault();
      return;
    }

    // Handle digit input
    if (/^\d$/.test(key)) {
      // Clear all subsequent fields when changing a digit
      for (let i = index + 1; i < 6; i++) {
        this.otpForm.get(otpKeys[i])?.setValue('');
      }
      // Set current digit
      this.otpForm.get(otpKeys[index])?.setValue(key);
      // Move to next input if not last
      if (index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
      event.preventDefault();
      return;
    }

    // Block non-digit characters (but allow Tab, Enter, Escape, and function keys)
    if (
      ![
        'Tab',
        'Enter',
        'Escape',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
      ].includes(key)
    ) {
      event.preventDefault();
    }
  }

  onOTPPaste(event: ClipboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6); // Extract only digits, max 6
    const otpKeys: (keyof typeof this.otpForm.controls)[] = [
      'otp0',
      'otp1',
      'otp2',
      'otp3',
      'otp4',
      'otp5',
    ];

    if (digits.length === 0) {
      return;
    }

    // Always fill from the beginning (index 0) when pasting
    // Clear all fields first
    for (let i = 0; i < 6; i++) {
      this.otpForm.get(otpKeys[i])?.setValue('');
    }

    // Fill inputs starting from index 0
    for (let i = 0; i < digits.length && i < 6; i++) {
      this.otpForm.get(otpKeys[i])?.setValue(digits[i]);
    }

    // Focus the next empty input or the last input
    const nextEmptyIndex = Math.min(digits.length, 5);
    setTimeout(() => {
      const nextInput = document.getElementById(`otp-${nextEmptyIndex}`) as HTMLInputElement;
      nextInput?.focus();
    }, 0);
  }

  onOTPInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Remove non-digits
    const otpKeys: (keyof typeof this.otpForm.controls)[] = [
      'otp0',
      'otp1',
      'otp2',
      'otp3',
      'otp4',
      'otp5',
    ];

    if (value.length > 1) {
      // Handle case where user types multiple digits (e.g., autofill or paste)
      // Clear all fields first
      for (let i = 0; i < 6; i++) {
        this.otpForm.get(otpKeys[i])?.setValue('');
      }
      // Fill from the beginning
      const digits = value.slice(0, 6);
      for (let i = 0; i < digits.length && i < 6; i++) {
        this.otpForm.get(otpKeys[i])?.setValue(digits[i]);
      }
      // Focus next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      const nextInput = document.getElementById(`otp-${nextIndex}`) as HTMLInputElement;
      nextInput?.focus();
    } else if (value.length === 1) {
      // Single digit entered
      // Clear all subsequent fields when changing a digit
      for (let i = index + 1; i < 6; i++) {
        this.otpForm.get(otpKeys[i])?.setValue('');
      }
      // Set current digit
      this.otpForm.get(otpKeys[index])?.setValue(value);
      // Move to next input if not last
      if (index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    } else {
      // Empty value - clear current and all subsequent fields
      this.otpForm.get(otpKeys[index])?.setValue('');
      for (let i = index + 1; i < 6; i++) {
        this.otpForm.get(otpKeys[i])?.setValue('');
      }
    }
  }

  openEmailClient() {
    if (this.userEmail) {
      window.location.href = `mailto:${this.userEmail}`;
    }
  }
}
