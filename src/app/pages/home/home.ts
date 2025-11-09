import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProductsList } from '../../products/components/products-list/products-list';
import { Hero } from '../../shared/components/hero/hero';
@Component({
  selector: 'app-home',
  imports: [ButtonModule, Hero, ProductsList],
  templateUrl: './home.html',
})
export class Home {}
