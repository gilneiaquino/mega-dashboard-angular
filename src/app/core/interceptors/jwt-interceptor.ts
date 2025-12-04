import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const tenant = localStorage.getItem('tenant');

  if (!token && !tenant) {
    return next(req);
  }

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (tenant) {
    headers['X-Tenant-ID'] = tenant;
  }

  const newReq = req.clone({ setHeaders: headers });

  return next(newReq);
};
