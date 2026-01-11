import { Component, Input } from '@angular/core';
import { IProduct } from '../../product.interface';
import { ZardDividerComponent } from '@shared/components/ui/divider/divider.component';
import { ZardBadgeComponent } from '@shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-product-card',
  imports: [ZardDividerComponent, ZardBadgeComponent],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input() product!: IProduct;
  protected defaultImage = '/assets/images/product-fallback.png';
}
