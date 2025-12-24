export type Perfil = 'ADMIN' | 'USER';

export interface UsuarioToken {
  nome?: string;
  perfil?: Perfil;
  tenant?: string;
  sub?: string;
  exp?: number;
  iat?: number;
}
