import { Component, Input } from '@angular/core';
import { IProduct } from '../../product.interface';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input() product!: IProduct;
  protected defaultImage =
    'https://images.unsplash.com/photo-1724391114112-c83ad59f1d5f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2129';
}
