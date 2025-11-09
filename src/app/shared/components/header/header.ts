import { Component, inject } from '@angular/core';
import { Route, ROUTES } from '@angular/router';
import { DarkModeService } from '@shared/services/darkmode/darkmode';
import { ZardButtonComponent } from '../ui/button/button.component';
import { ZardIconComponent } from '../ui/icon/icon.component';

@Component({
  selector: 'app-header',
  imports: [ZardButtonComponent, ZardIconComponent],
  templateUrl: './header.html',
})
export class Header {
  private readonly darkmodeService = inject(DarkModeService);

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
  toggleTheme(): void {
    this.darkmodeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }
}
