import { Component, inject } from '@angular/core';
import { Route, ROUTES } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  public menuItems: unknown[];
  public authItems: unknown[];
  constructor() {
    const routes = inject(ROUTES)[0] as Route[];
    this.menuItems = routes
      .filter((route) => route.path && !route.path.includes('auth') && route.data?.['label'])
      .map((route) => ({
        label: route.data?.['label'],
        icon: route.data?.['icon'] || '',
        routerLink: [route.path],
        routerLinkActiveOptions: { exact: true },
      }));

    this.authItems = routes
      .filter((route) => route.path && route.path.includes('auth') && route.data?.['label'])
      .map((route) => ({
        label: route.data?.['label'],
        icon: route.data?.['icon'] || '',
        routerLink: [route.path],
        routerLinkActiveOptions: { exact: true },
      }));
  }
}
