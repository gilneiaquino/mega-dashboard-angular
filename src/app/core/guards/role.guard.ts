import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const usuario = auth.getUsuario();

    // não logado -> login
    if (!usuario) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // sem permissão -> forbidden
    if (!allowedRoles.includes(usuario.perfil)) {
      return router.createUrlTree(['/forbidden']);
    }

    return true;
  };
};
