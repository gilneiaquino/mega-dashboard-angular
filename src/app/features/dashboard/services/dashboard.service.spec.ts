import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DashboardService} from './dashboard.service';
import {DashboardFiltro} from '../model/dashboard-filtro';
import {DashboardResponse} from '../model/dashboard-response';
import {environment} from '../../../../environments/environment';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  // ✅ tem que bater com o service: /api/dashboards
  const baseUrl = `${environment.apiUrl}/api/dashboards`;

  const mockResponse: DashboardResponse = {
    carteiraFisica: [],
    carteiraFinanceira: [],
    evolucao: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve chamar GET sem parâmetros quando filtro for null', () => {
    let resposta: DashboardResponse | undefined;

    service.consultar(null).subscribe(res => (resposta = res));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockResponse);
    expect(resposta).toEqual(mockResponse);
  });

  it('deve chamar GET sem parâmetros quando filtro for undefined', () => {
    let resposta: DashboardResponse | undefined;

    service.consultar(undefined).subscribe(res => (resposta = res));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockResponse);
    expect(resposta).toEqual(mockResponse);
  });

  it('não deve enviar status quando for TODOS', () => {
    const filtro: DashboardFiltro = {
      status: 'TODOS'
    } as DashboardFiltro;

    service.consultar(filtro).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    // ✅ regra do service: status só vai se for diferente de TODOS
    expect(req.request.params.has('status')).toBeFalse();

    req.flush(mockResponse);
  });

  it('deve ignorar campos vazios do filtro', () => {
    const filtro: DashboardFiltro = {
      dataInicio: '',
      dataFim: '',
      categoria: '',
      status: undefined as any
    };

    service.consultar(filtro).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockResponse);
  });
});
