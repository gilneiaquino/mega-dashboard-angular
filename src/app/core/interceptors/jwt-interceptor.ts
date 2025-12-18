import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const tenant = localStorage.getItem('tenant');

  const isLogin = req.url.includes('/auth/login');

  const headers: Record<string, string> = {};

  // manda tenant sempre que existir (inclusive no login)
  if (tenant) {
    headers['X-Tenant-Id'] = tenant; // <-- use um nome só (veja observação abaixo)
  }

  // NÃO manda Authorization no login
  if (!isLogin && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // se não tem nada pra setar, passa direto
  if (Object.keys(headers).length === 0) {
    return next(req);
  }

  return next(req.clone({ setHeaders: headers }));
};
