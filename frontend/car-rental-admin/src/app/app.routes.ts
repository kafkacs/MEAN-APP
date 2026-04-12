import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Layout } from './pages/layout/layout';
import { authenticationGuard } from './core/guards/authentication-guard';
import { NotFound } from './pages/error-pages/not-found/not-found';
import { Unauthorized } from './pages/error-pages/unauthorized/unauthorized';
import { Cars } from './pages/cars/cars';
import { CreateCar } from './pages/cars/create-car/create-car';
import { UpdateCar } from './pages/cars/update-car/update-car';
import { Contact } from './pages/contact/contact';
import { Profile } from './pages/profile/profile';
import { Users } from './pages/users/users';
import { UserDetails } from './pages/users/user-details/user-details';
import { CreateUser } from './pages/users/create-user/create-user';
import { UpdateUser } from './pages/users/update-user/update-user';
import { Bookings } from './pages/bookings/bookings';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authenticationGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'cars' },
      { path: 'cars', component: Cars, title: 'Cars Management' },
      { path: 'create-car', component: CreateCar, title: 'Create Car' },
      { path: 'edit-car/:carID', component: UpdateCar, title: 'Edit Car' },
      { path: 'contact', component: Contact, title: 'Contact' },
      { path: 'profile', component: Profile, title: 'Profile' },
      { path: 'users', component: Users, title: 'Users' },
      { path: 'create-user', component: CreateUser, title: 'Create User' },
      { path: 'update-user/:userID', component: UpdateUser, title: 'Update User' },
      { path: 'users/:userID', component: UserDetails, title: 'User Details' },
      { path: 'bookings', component: Bookings, title: 'Bookings' },
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
