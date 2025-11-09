import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Lines } from './pages/lines/lines';
import { Login } from './pages/login/login';
import { Models } from './pages/models/models';
import { Register } from './pages/register/register';
import { SecondHand } from './pages/second-hand/second-hand';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
    data: { label: 'Home' },
  },
  {
    path: 'home',
    redirectTo: '/',
    data: { label: 'Home' },
  },
  { path: 'models', component: Models, data: { label: 'Models' } },
  { path: 'lines', component: Lines, data: { label: 'Lines' } },
  {
    path: 'second-hand',
    component: SecondHand,
    data: { label: 'Second Hand' },
  },
  { path: 'auth/login', component: Login, data: { label: 'Login' } },
  {
    path: 'auth/register',
    component: Register,
    data: { label: 'Register' },
  },
  {
    path: 'auth/logout',
    redirectTo: '/',
    data: { label: 'Logout' },
  },
];
