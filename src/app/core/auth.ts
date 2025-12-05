import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
  tenant: string;
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  login: string;
  perfil: string;
  tenant: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioLogado;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);

  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private tenantKey = 'tenant';

  login(body: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-ID': body.tenant
    });

    return this.http.post<LoginResponse>(
      '/auth/login',
      {
        login: body.username,
        senha: body.password
      },
      { headers }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.usuario));
        localStorage.setItem(this.tenantKey, res.usuario.tenant);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tenantKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsuario(): UsuarioLogado | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) as UsuarioLogado : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
