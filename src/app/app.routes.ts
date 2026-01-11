import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Lines } from './pages/lines/lines';
import { Login } from './pages/login/login';
import { Models } from './pages/models/models';
import { Register } from './pages/register/register';
import { PasswordResetRequest } from './pages/password-reset-request/password-reset-request';
import { ResetPassword } from './pages/reset-password/reset-password';
import { SecondHand } from './pages/second-hand/second-hand';
import { authGuard } from '@authentication/auth.guard';
import { adminGuard } from '@authentication/admin.guard';
import { Layout } from './shared/components/layout/layout';
import { ValidateResetToken } from './pages/validate-reset-token/validate-reset-token';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: Home,
        title: 'Home',
      },
      {
        path: 'models',
        component: Models,
        title: 'Models',
      },
      {
        path: 'lines',
        component: Lines,
        title: 'Lines',
      },
      {
        path: 'second-hand',
        component: SecondHand,
        title: 'Second Hand',
      },
    ],
  },
  {
    path: 'studio',
    component: Layout,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard',
      },
    ],
  },
  {
    path: 'auth/login',
    component: Login,
    title: 'Login',
  },
  {
    path: 'auth/register',
    component: Register,
    title: 'Register',
  },
  {
    path: 'auth/password-reset-request',
    component: PasswordResetRequest,
    title: 'Reset Password',
  },
  {
    path: 'auth/validate-reset-token',
    component: ValidateResetToken,
    title: 'Validating Reset Token',
  },
  {
    path: 'auth/reset-password',
    component: ResetPassword,
    title: 'Reset Password',
  },
];
