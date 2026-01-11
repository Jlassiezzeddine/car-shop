import { Component, signal } from '@angular/core';
import { ProductsList } from './components/products-list/products-list';
import { UsersList } from './components/users-list/users-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UsersList, ProductsList],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  activeTab = signal<'users' | 'products'>('users');

  setTab(tab: 'users' | 'products'): void {
    this.activeTab.set(tab);
  }
}
