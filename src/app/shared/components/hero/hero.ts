import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero',
  imports: [ButtonModule],
  templateUrl: './hero.html',
})
export class Hero {}
