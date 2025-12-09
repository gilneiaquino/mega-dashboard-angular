import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

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
  private apiUrl = environment.apiUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private tenantKey = 'tenant';

  // --- util SSR-safe ---
  private hasLocalStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  // --- login / logout ---

  login(body: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-ID': body.tenant
    });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      {
        login: body.username,
        senha: body.password
      },
      { headers }
    ).pipe(
      tap(res => {
        if (!this.hasLocalStorage()) {
          return;
        }
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.usuario));
        localStorage.setItem(this.tenantKey, res.usuario.tenant);
      })
    );
  }

  logout(): void {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tenantKey);
  }

  // --- helpers ---

  getToken(): string | null {
    if (!this.hasLocalStorage()) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);  // 👈 agora usa tokenKey
  }

  setToken(token: string): void {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
