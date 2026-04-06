import { Routes } from '@angular/router';
import { Signup } from './pages/auth/signup/signup';
import { Login } from './pages/auth/login/login';
import { Cars } from './pages/cars/cars';
import { Landing } from './pages/landing/landing';
import { Layout } from './pages/layout/layout';
import { CarDetails } from './pages/cars/car-details/car-details';
import { Contact } from './pages/contact/contact';
import { Rent } from './pages/rent/rent';
import { Confirmed } from './pages/rent/confirmed/confirmed';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'landing' },
      { path: 'landing', component: Landing, title: 'Car Rental - Home' },
      { path: 'contact', component: Contact, title: 'Car Rental - Contact' },
      { path: 'cars', component: Cars, title: 'Car Rental - Cars' },
      {
        path: 'car-details/:carID',
        component: CarDetails,
        title: 'Car Rental - Car Details',
      },
      { path: 'rent/:carID', component: Rent, title: 'Car Rental - Rent' },
      {
        path: 'confirmed',
        component: Confirmed,
        title: 'Car Rental - Confirmed',
      },
    ],
  },
  { path: 'auth/login', component: Login, title: 'Login' },
  { path: 'auth/signup', component: Signup, title: 'Sign up' },
  { path: '**', redirectTo: 'landing' },
];
