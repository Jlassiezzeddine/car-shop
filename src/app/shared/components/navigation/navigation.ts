import { Component, inject, computed } from '@angular/core';
import { Route, RouterLink, ROUTES } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DarkModeService } from '@shared/services/darkmode/darkmode';
import { ZardButtonComponent } from '../ui/button/button.component';
import { ZardDividerComponent } from '../ui/divider/divider.component';
import { ZardIconComponent } from '../ui/icon/icon.component';
import { LogoutButton } from '@authentication/logout-button/logout-button';
import { AuthService } from '@authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [
    CommonModule,
    ZardButtonComponent,
    ZardIconComponent,
    RouterLink,
    ZardDividerComponent,
    LogoutButton,
  ],
  templateUrl: './navigation.html',
})
export class Navigation {
  private readonly darkmodeService = inject(DarkModeService);
  private readonly authService = inject(AuthService);
  protected showMenu = false;
  protected menuItems: Route[];
  protected authItems: Route[];
  // Get current user as a signal and compute admin status reactively
  private currentUser = toSignal(this.authService.getCurrentUser(), { initialValue: null });
  protected isAdmin = computed(() => {
    const user = this.currentUser();
    return user !== null && user.role === 'admin';
  });
  constructor() {
    const routes = inject(ROUTES)[0] as Route[];
    const flattenedRoutes = this.flattenRoutes(routes);
    // Filter menu items: exclude auth routes and studio/dashboard (dashboard is shown conditionally based on admin role)
    this.menuItems = flattenedRoutes.filter(
      (route) =>
        !route.path?.includes('auth') &&
        !route.path?.includes('dashboard') &&
        !route.path?.includes('studio') &&
        route.title,
    );
    this.authItems = flattenedRoutes.filter((route) => route.path?.includes('auth') && route.title);
  }

  private flattenRoutes(routes: Route[], parentPath = ''): Route[] {
    const result: Route[] = [];
    for (const route of routes) {
      // Build absolute path by combining parent path with current route path
      const absolutePath = this.buildAbsolutePath(parentPath, route.path || '');

      if (route.title) {
        // Create a new route object with the absolute path
        result.push({
          ...route,
          path: absolutePath,
        });
      }
      if (route.children) {
        // Recursively flatten children with the current absolute path as parent
        result.push(...this.flattenRoutes(route.children, absolutePath));
      }
    }
    return result;
  }

  private buildAbsolutePath(parentPath: string, routePath: string): string {
    if (!routePath) {
      return parentPath || '/';
    }
    if (!parentPath) {
      return routePath.startsWith('/') ? routePath : `/${routePath}`;
    }
    // Remove trailing slash from parent and leading slash from routePath, then combine
    const cleanParent = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;
    const cleanRoute = routePath.startsWith('/') ? routePath.slice(1) : routePath;
    const combined = cleanParent ? `${cleanParent}/${cleanRoute}` : cleanRoute;
    return combined.startsWith('/') ? combined : `/${combined}`;
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
