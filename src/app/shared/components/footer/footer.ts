import { Component, inject } from '@angular/core';
import { Route, RouterLink, ROUTES } from '@angular/router';
import { ZardDividerComponent } from '../ui/divider/divider.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, ZardDividerComponent],
  templateUrl: './footer.html',
})
export class Footer {
  protected menuItems: Route[];
  protected currentYear: number = new Date().getFullYear();

  constructor() {
    const routes = inject(ROUTES)[0] as Route[];
    this.menuItems = routes.filter((route) => !route.path?.includes('auth') && route.title);
  }
}
