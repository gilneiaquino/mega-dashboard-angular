import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthStorage } from './auth.storage';
import { decodeJwt, isExpired } from './jwt.utils';
import { Perfil, UsuarioToken } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user$ = new BehaviorSubject<UsuarioToken | null>(this.readUserFromToken());
  user$ = this._user$.asObservable();

  get token(): string | null {
    return AuthStorage.getToken();
  }

  get user(): UsuarioToken | null {
    return this._user$.value;
  }

  isAuthenticated(): boolean {
    const token = this.token;
    if (!token) return false;
    const payload = decodeJwt(token);
    return !!payload && !isExpired(payload);
  }

  hasRole(roles: Perfil[]): boolean {
    const perfil = this.user?.perfil;
    return !!perfil && roles.includes(perfil);
  }

  setToken(token: string): void {
    AuthStorage.setToken(token);
    this._user$.next(this.readUserFromToken());
  }

  logout(): void {
    AuthStorage.clear();
    this._user$.next(null);
  }

  private readUserFromToken(): UsuarioToken | null {
    const token = AuthStorage.getToken();
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload || isExpired(payload)) return null;
    return payload;
  }
}
