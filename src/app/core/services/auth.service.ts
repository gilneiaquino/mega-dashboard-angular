import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private readonly tenantKey = 'tenant';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private hasLocalStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'X-Tenant-ID': body.tenant });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      { login: body.username, senha: body.password },
      { headers }
    ).pipe(
      tap(res => {
        if (!this.hasLocalStorage()) return;

        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.usuario));
        localStorage.setItem(this.tenantKey, res.usuario?.tenant ?? body.tenant);
      })
    );
  }

  logout(): void {
    if (!this.hasLocalStorage()) return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tenantKey);
  }

  getToken(): string | null {
    if (!this.hasLocalStorage()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getUsuario(): UsuarioLogado | null {
    if (!this.hasLocalStorage()) return null;

    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as UsuarioLogado;
    } catch {
      return null;
    }
  }

  getTenant(): string | null {
    if (!this.hasLocalStorage()) return null;
    return localStorage.getItem(this.tenantKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
