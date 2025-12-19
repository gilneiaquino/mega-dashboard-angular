import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getToken();
  const tenant = authService.getTenant();

  const isLogin = req.url.includes('/auth/login');

  let headers = req.headers;

  // sempre envia tenant, inclusive no login
  if (tenant) {
    headers = headers.set('X-Tenant-ID', tenant);
  }

  // não envia Authorization no login
  if (!isLogin && token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // se nada mudou, segue sem clone
  if (headers === req.headers) {
    return next(req);
  }

  return next(req.clone({ headers }));
};
