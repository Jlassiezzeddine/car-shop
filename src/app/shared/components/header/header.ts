import { Component, inject } from '@angular/core';
import { Route, RouterLink, ROUTES } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [MenubarModule, RouterLink, ButtonModule],
  templateUrl: './header.html',
})
export class Header {
  public menuItems: MenuItem[];
  public authItems: MenuItem[];
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
