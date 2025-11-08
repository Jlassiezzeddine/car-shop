import { Routes } from '@angular/router';
import { AddProduct } from './pages/add-product/add-product';
import { Home } from './pages/home/home';
import { Lines } from './pages/lines/lines';
import { Login } from './pages/login/login';
import { Logout } from './pages/logout/logout';
import { Models } from './pages/models/models';
import { Register } from './pages/register/register';
import { SecondHand } from './pages/second-hand/second-hand';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
    data: { label: 'Home', icon: 'pi pi-fw pi-home' },
  },
  {
    path: 'home',
    redirectTo: '/',
    data: { label: 'Home', icon: 'pi pi-fw pi-home' },
  },
  { path: 'models', component: Models, data: { label: 'Models', icon: 'pi pi-fw pi-car' } },
  { path: 'lines', component: Lines, data: { label: 'Lines', icon: 'pi pi-fw pi-list' } },
  {
    path: 'second-hand',
    component: SecondHand,
    data: { label: 'Second Hand', icon: 'pi pi-fw pi-tag' },
  },
  {
    path: 'add-product',
    component: AddProduct,
    data: { label: 'Add Product', icon: 'pi pi-fw pi-plus' },
  },
  { path: 'auth/login', component: Login, data: { label: 'Login', icon: 'pi pi-fw pi-sign-in' } },
  {
    path: 'auth/register',
    component: Register,
    data: { label: 'Register', icon: 'pi pi-fw pi-user-plus' },
  },
  {
    path: 'auth/logout',
    component: Logout,
    data: { label: 'Logout', icon: 'pi pi-fw pi-sign-out' },
  },
];
