import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {environment} from '../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
  tenant: string; // vindo do formulário de login
}

export interface LoginResponse {
  token: string;   // ajusta pro que o backend devolver
  nome?: string;
  perfil?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl ?? 'http://localhost:8080';

  private tokenKey = 'auth_token';
  private tenantKey = 'tenant';

  login(body: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-ID': body.tenant
    });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, body, { headers })
      .pipe(
        tap(res => {
          if (res.token) {
            localStorage.setItem(this.tokenKey, res.token);
          }
          localStorage.setItem(this.tenantKey, body.tenant);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tenantKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTenant(): string | null {
    return localStorage.getItem(this.tenantKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
