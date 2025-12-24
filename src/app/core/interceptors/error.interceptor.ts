import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          auth.logout();
          if (!router.url.startsWith('/login')) {
            router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
          }
        }

        if (err.status === 403) {
          // mantém logado e só manda pra acesso negado
          if (!router.url.startsWith('/forbidden')) {
            router.navigate(['/forbidden']);
          }
        }
      }
      return throwError(() => err);
    })
  );
};
