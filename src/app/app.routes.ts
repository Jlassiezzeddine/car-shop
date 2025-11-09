import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Lines } from './pages/lines/lines';
import { Login } from './pages/login/login';
import { Models } from './pages/models/models';
import { Register } from './pages/register/register';
import { SecondHand } from './pages/second-hand/second-hand';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  { path: 'models', component: Models, title: 'Models' },
  { path: 'lines', component: Lines, title: 'Lines' },
  {
    path: 'second-hand',
    component: SecondHand,
    title: 'Second Hand',
  },
  { path: 'auth/login', component: Login, title: 'Login' },
  {
    path: 'auth/register',
    component: Register,
    title: 'Register',
  },
  {
    path: 'auth/logout',
    redirectTo: '/',
    title: 'Logout',
  },
];
