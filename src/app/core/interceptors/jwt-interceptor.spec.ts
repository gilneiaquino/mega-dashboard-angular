import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { jwtInterceptor } from './jwt-interceptor';
import { AuthService } from '../services/auth.service';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['getToken', 'getTenant']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('deve adicionar Authorization e X-Tenant-ID em requisições não login', () => {
    auth.getToken.and.returnValue('tok123');
    auth.getTenant.and.returnValue('empresa-x');

    http.get('/api/dashboards').subscribe();

    const req = httpMock.expectOne('/api/dashboards');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok123');
    expect(req.request.headers.get('X-Tenant-ID')).toBe('empresa-x');

    req.flush({});
  });

  it('não deve adicionar Authorization no login, mas deve mandar tenant se existir', () => {
    auth.getToken.and.returnValue('tok123');
    auth.getTenant.and.returnValue('empresa-x');

    http.post('/auth/login', { login: 'a', senha: 'b' }).subscribe();

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('X-Tenant-ID')).toBe('empresa-x');

    req.flush({ token: 'x', usuario: {} });
  });
});
