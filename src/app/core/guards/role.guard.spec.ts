import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard (Jasmine)', () => {
  let router: jasmine.SpyObj<Router>;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['getUsuario']);

    router.createUrlTree.and.callFake((commands: any[], extras?: any) => ({ commands, extras }) as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth },
      ],
    });
  });

  it('deve redirecionar para /login quando não estiver logado', () => {
    auth.getUsuario.and.returnValue(null as any);

    const guard = roleGuard(['ADMIN']);
    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: '/configuracoes' } as any)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/configuracoes' } }
    );
    expect((result as any).commands).toEqual(['/login']);
  });

  it('deve redirecionar para /forbidden quando não tiver permissão', () => {
    auth.getUsuario.and.returnValue({ perfil: 'USER' } as any);

    const guard = roleGuard(['ADMIN']);
    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: '/configuracoes' } as any)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
    expect((result as any).commands).toEqual(['/forbidden']);
  });

  it('deve permitir quando tiver permissão', () => {
    auth.getUsuario.and.returnValue({ perfil: 'ADMIN' } as any);

    const guard = roleGuard(['ADMIN']);
    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: '/configuracoes' } as any)
    );

    expect(result).toBeTrue();
  });
});
