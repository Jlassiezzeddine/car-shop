import { Component, inject, input, output, effect, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../products/product.service';
import { IProduct, IProductCreate, IProductUpdate } from '../../../../products/product.interface';
import { ZardInputDirective } from '@shared/components/ui/input/input.directive';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ZardInputDirective, ZardButtonComponent],
  templateUrl: './product-form.html',
})
export class ProductForm {
  product = input<IProduct | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private productService = inject(ProductService);

  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup({
    model: new FormControl<string>('', [Validators.required, Validators.minLength(1)]),
    power: new FormControl<string>('', [Validators.required]),
    gearbox: new FormControl<string>('', [Validators.required]),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    newPrice: new FormControl<number | null>(null, [Validators.min(0)]),
    range: new FormControl<string>('', [Validators.required]),
    autonomy: new FormControl<string>(''),
    image: new FormControl<string>('', [Validators.required]),
    quantity: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
  });

  constructor() {
    // Reactively update form when product input changes
    effect(() => {
      const product = this.product();
      if (product) {
        this.isEditMode.set(true);
        this.form.patchValue({
          model: product.model,
          power: product.power,
          gearbox: product.gearbox,
          price: product.price,
          newPrice: product.newPrice || null,
          range: product.range,
          autonomy: product.autonomy || '',
          image: product.image,
          quantity: product.quantity,
        });
      } else {
        // Reset form when switching to add mode
        this.isEditMode.set(false);
        this.form.reset({
          model: '',
          power: '',
          gearbox: '',
          price: 0,
          newPrice: null,
          range: '',
          autonomy: '',
          image: '',
          quantity: 0,
        });
        this.errorMessage.set(null);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const formValue = this.form.value;
      const product = this.product();

      if (product) {
        // Update existing product
        const updateData: IProductUpdate = {
          model: formValue.model!,
          power: formValue.power!,
          gearbox: formValue.gearbox!,
          price: formValue.price!,
          newPrice: formValue.newPrice || undefined,
          range: formValue.range!,
          autonomy: formValue.autonomy || undefined,
          image: formValue.image!,
          quantity: formValue.quantity!,
        };

        this.productService.updateProduct(product.id, updateData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.saved.emit();
          },
          error: (error: { error?: { message?: string } }) => {
            this.isLoading.set(false);
            this.errorMessage.set(
              error?.error?.message || 'Failed to update product. Please try again.',
            );
          },
        });
      } else {
        // Create new product
        const createData: IProductCreate = {
          model: formValue.model!,
          power: formValue.power!,
          gearbox: formValue.gearbox!,
          price: formValue.price!,
          newPrice: formValue.newPrice || undefined,
          range: formValue.range!,
          autonomy: formValue.autonomy || undefined,
          image: formValue.image!,
          quantity: formValue.quantity!,
        };

        this.productService.addProduct(createData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.saved.emit();
          },
          error: (error: { error?: { message?: string } }) => {
            this.isLoading.set(false);
            this.errorMessage.set(
              error?.error?.message || 'Failed to create product. Please try again.',
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

  getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors?.['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be greater than or equal to ${control.errors['min'].min}`;
      }
      if (control.errors?.['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }
}
