import { Routes } from '@angular/router';
import { Signup } from './pages/auth/signup/signup';
import { Login } from './pages/auth/login/login';
import { Cars } from './pages/cars/cars';
import { Landing } from './pages/landing/landing';
import { Layout } from './pages/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'landing' },
      { path: 'landing', component: Landing, title: 'Car Rental - Home' },
      { path: 'cars', component: Cars, title: 'Car Rental - Cars' },
    ],
  },
  { path: 'auth/login', component: Login, title: 'Login' },
  { path: 'auth/signup', component: Signup, title: 'Sign up' },
  { path: '**', redirectTo: 'landing' },
];
