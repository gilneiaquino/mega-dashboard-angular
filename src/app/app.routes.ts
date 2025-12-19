import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ShellComponent } from './features/shell/shell.component';

export const routes: Routes = [
  // raiz → login
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // login público
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  // área protegida com layout universal
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },

      {
        path: 'relatorios',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./features/relatorios/relatorios.component')
            .then(m => m.RelatoriosComponent)
      },

      {
        path: 'configuracoes',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./features/config/config.component')
            .then(m => m.ConfigComponent)
      },

      {
        path: 'forbidden',
        loadComponent: () =>
          import('./features/forbidden/forbidden.component')
            .then(m => m.ForbiddenComponent)
      }
    ]
  },

  // fallback
  { path: '**', redirectTo: 'login' }
];
