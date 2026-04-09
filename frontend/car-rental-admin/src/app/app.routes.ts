import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Layout } from './pages/layout/layout';
import { authenticationGuard } from './core/guards/authentication-guard';
import { NotFound } from './pages/error-pages/not-found/not-found';
import { Unauthorized } from './pages/error-pages/unauthorized/unauthorized';
import { Cars } from './pages/cars/cars';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authenticationGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'cars' },
      { path: 'cars', component: Cars, title: 'Cars Management' },
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login,
        title: 'Login',
      },
    ],
  },
  {
    path: 'errors',
    children: [{ path: 'unauthorized', component: Unauthorized }],
  },
  { path: '**', component: NotFound },
];
