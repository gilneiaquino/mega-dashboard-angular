import { UsuarioToken } from './auth.types';

export function decodeJwt(token: string): UsuarioToken | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isExpired(payload: UsuarioToken | null): boolean {
  if (!payload?.exp) return false; // se não tiver exp, não bloqueia
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}
