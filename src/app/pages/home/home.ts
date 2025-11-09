import { Component } from '@angular/core';
import { ProductsList } from '../../products/components/products-list/products-list';
import { Hero } from '../../shared/components/hero/hero';
@Component({
  selector: 'app-home',
  imports: [Hero, ProductsList],
  templateUrl: './home.html',
})
export class Home {}
