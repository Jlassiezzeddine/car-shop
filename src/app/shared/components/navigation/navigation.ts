import { Component, inject } from '@angular/core';
import { Route, RouterLink, ROUTES } from '@angular/router';
import { DarkModeService } from '@shared/services/darkmode/darkmode';
import { ZardButtonComponent } from '../ui/button/button.component';
import { ZardDividerComponent } from '../ui/divider/divider.component';
import { ZardIconComponent } from '../ui/icon/icon.component';

@Component({
  selector: 'app-navigation',
  imports: [ZardButtonComponent, ZardIconComponent, RouterLink, ZardDividerComponent],
  templateUrl: './navigation.html',
})
export class Navigation {
  private readonly darkmodeService = inject(DarkModeService);
  protected showMenu = false;
  protected menuItems: Route[];
  protected authItems: Route[];

  constructor() {
    const routes = inject(ROUTES)[0] as Route[];
    this.menuItems = routes.filter((route) => !route.path?.includes('auth') && route.title);

    this.authItems = routes.filter((route) => route.path?.includes('auth') && route.title);
  }
  toggleTheme(): void {
    this.darkmodeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
