import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('deve permitir acesso quando logado', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBeTrue();
  });

  it('deve redirecionar para /login quando não logado', () => {
    authService.isLoggedIn.and.returnValue(false);
    router.createUrlTree.and.returnValue({} as any);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/dashboard' } }
    );
    expect(result).toEqual({} as any);
  });
});
