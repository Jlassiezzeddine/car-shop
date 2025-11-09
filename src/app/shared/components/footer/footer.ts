import { Component, inject } from '@angular/core';
import { Route, RouterLink, ROUTES } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  protected menuItems: unknown[];
  protected currentYear: number = new Date().getFullYear();

  constructor() {
    const routes = inject(ROUTES)[0] as Route[];
    this.menuItems = routes
      .filter(
        (route) =>
          route.path &&
          !route.path.includes('auth') &&
          !route.path.includes('home') &&
          route.data?.['label'],
      )
      .map((route) => ({
        label: route.data?.['label'],
        icon: route.data?.['icon'] || '',
        routerLink: [route.path],
        routerLinkActiveOptions: { exact: true },
      }));
  }
}
