import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // rota raiz → login
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  // login público
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  // dashboard protegido
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  // grupo protegido
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/relatorios/relatorios.component')
            .then(m => m.RelatoriosComponent)
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./features/config/config.component')
            .then(m => m.ConfigComponent)
      }
    ]
  },

  // fallback
  {
    path: '**',
    redirectTo: 'login'
  }
];
