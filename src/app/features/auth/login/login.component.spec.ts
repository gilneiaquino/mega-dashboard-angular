import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import {AuthService, LoginRequest, LoginResponse} from '../../../core/services/auth.service';



const mockLoginResponse: LoginResponse = {
  token: 'fake-jwt-token',
  usuario: {
    nome: 'Admin',
    perfil: 'ADMIN',
    // coloque aqui os campos obrigatórios do seu UsuarioLogado
    // ex: id: 1, login: 'admin', tenant: 'empresa-x' ...
  } as any
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) =>
                  key === 'returnUrl' ? '/dashboard' : null
              }
            }
          }
        },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('não deve chamar login se o formulário for inválido', () => {
    component.form.setValue({
      username: '',
      password: '',
      tenant: ''
    });

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('deve chamar AuthService.login com os dados do formulário', () => {
    const dto: LoginRequest = {
      username: 'admin',
      password: '123',
      tenant: 'empresa-x'
    };

    component.form.setValue(dto);
    authService.login.and.returnValue(of(mockLoginResponse)); // ✅ aqui

    component.submit();

    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('deve navegar para returnUrl após login com sucesso', () => {
    component.form.setValue({
      username: 'admin',
      password: '123',
      tenant: 'empresa-x'
    });

    authService.login.and.returnValue(of(mockLoginResponse)); // ✅ aqui

    component.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('deve exibir mensagem de erro quando login falhar', () => {
    component.form.setValue({
      username: 'admin',
      password: 'errado',
      tenant: 'empresa-x'
    });

    authService.login.and.returnValue(
      throwError(() => ({
        error: { message: 'Credenciais inválidas' }
      }))
    );

    component.submit();

    expect(component.errorMessage).toBe('Credenciais inválidas');
    expect(component.loading).toBeFalse();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
