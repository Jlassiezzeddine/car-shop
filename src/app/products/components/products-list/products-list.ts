import { Component, inject } from '@angular/core';
import {
  IApiPagination,
  IApiPaginationParams,
} from '@shared/interfaces/api-list-response.interface';
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
  protected pagination!: IApiPagination;

  constructor() {
    this.loadProducts();
  }

  loadProducts(params?: IApiPaginationParams) {
    this.productService.getProducts(params).subscribe({
      next: (data) => {
        this.products = data.data.data;
        this.pagination = data.data.meta;
      },
      error: (err) => console.error('Error loading products', err),
    });
  }

  onPageChange(page: number) {
    this.loadProducts({ page });
  }
}
