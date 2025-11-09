import { Component, inject } from '@angular/core';
import { IProduct } from '../../product.interface';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-products-list',
  imports: [],
  templateUrl: './products-list.html',
})
export class ProductsList {
  private productService = inject(ProductService);
  protected products: IProduct[] = [];
  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data.data.data),
      error: (err) => console.error('Error loading products', err),
    });
  }
}
