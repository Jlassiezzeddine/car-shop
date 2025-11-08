import { Component, inject } from '@angular/core';
import { Route, ROUTES } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-header',
  imports: [MenubarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public menuItems: MenuItem[];
  public authItems: MenuItem[];
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
    this.menuItems.unshift({
      label: 'CARSHOP',
      routerLink: ['/'],
      routerLinkActiveOptions: { exact: true },
    });
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
