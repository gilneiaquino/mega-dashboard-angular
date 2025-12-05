import { Routes } from '@angular/router';
import { Login } from './funcionalidades/auth/login/login';
import { inject } from '@angular/core';
import { Auth } from './core/auth';

const canActivateAuth = () => {
  const auth = inject(Auth);
  return auth.isLoggedIn();
};

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import('./funcionalidades/dashboard/dashboard').then(m => m.Dashboard)
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
