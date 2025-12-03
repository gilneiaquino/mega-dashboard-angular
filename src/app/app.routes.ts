import { Routes } from '@angular/router';
 import { inject } from '@angular/core';
import { Auth } from './core/auth';
import {Login} from './funcionalidades/auth/login/login';

const isAuth = () => inject(Auth).isLoggedIn();

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: 'dashboard',
    canActivate: [isAuth],
    loadComponent: () =>
      import('./funcionalidades/dashboard/dashboard').then(m => m.Dashboard)
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
