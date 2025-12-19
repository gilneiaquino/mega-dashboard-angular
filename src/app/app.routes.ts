import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

const canActivateAuth = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
};

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
