import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IApiPagination,
  IApiPaginationParams,
} from '@shared/interfaces/api-list-response.interface';
import { IProduct } from '../../product.interface';
import { ProductService } from '../../product.service';
import { ProductCard } from '../product-card/product-card';
import { ZardDividerComponent } from '@shared/components/ui/divider/divider.component';

@Component({
  selector: 'app-products-list',
  imports: [ProductCard, ZardDividerComponent],
  templateUrl: './products-list.html',
})
export class ProductsList implements OnInit {
  private productService = inject(ProductService);

  @Input() preview = false;
  protected products: IProduct[] = [];
  protected pagination!: IApiPagination;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(params?: IApiPaginationParams) {
    const paginationParams: IApiPaginationParams = this.preview
      ? { page: 1, limit: 10 }
      : params || {};
    this.productService.getProducts(paginationParams).subscribe({
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
