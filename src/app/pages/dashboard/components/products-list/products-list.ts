import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../products/product.service';
import { IProduct } from '../../../../products/product.interface';
import { IApiPaginationParams } from '@shared/interfaces/api-list-response.interface';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';
import { ZardIconComponent } from '@shared/components/ui/icon/icon.component';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardIconComponent, ProductForm],
  templateUrl: './products-list.html',
})
export class ProductsList implements OnInit {
  private productService = inject(ProductService);

  products = signal<IProduct[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingProduct = signal<IProduct | null>(null);
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  total = signal(0);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    const params: IApiPaginationParams = {
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    this.productService.getProducts(params).subscribe({
      next: (response: {
        data: { data: IProduct[]; meta: { total: number; totalPages: number } };
      }) => {
        this.products.set(response.data.data);
        this.total.set(response.data.meta.total);
        this.totalPages.set(response.data.meta.totalPages);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message || 'Failed to load products');
        this.loading.set(false);
      },
    });
  }

  openAddForm(): void {
    this.editingProduct.set(null);
    this.showForm.set(true);
  }

  openEditForm(product: IProduct): void {
    this.editingProduct.set(product);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingProduct.set(null);
  }

  onProductSaved(): void {
    this.closeForm();
    this.loadProducts();
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    this.loading.set(true);
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message || 'Failed to delete product');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
