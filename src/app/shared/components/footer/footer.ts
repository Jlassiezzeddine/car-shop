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
    const flattenedRoutes = this.flattenRoutes(routes);
    this.menuItems = flattenedRoutes.filter(
      (route) => !route.path?.includes('auth') && route.title,
    );
  }

  private flattenRoutes(routes: Route[]): Route[] {
    const result: Route[] = [];
    for (const route of routes) {
      if (route.title) {
        result.push(route);
      }
      if (route.children) {
        result.push(...this.flattenRoutes(route.children));
      }
    }
    return result;
  }
}
