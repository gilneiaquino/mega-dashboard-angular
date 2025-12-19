import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { DashboardFiltro } from '../model/dashboard-filtro';
import { DashboardResponse } from '../model/dashboard-response';
import { environment } from '../../../../environments/environment';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/api/dashboard`;

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

  it('deve chamar GET sem parâmetros quando filtro for null/undefined', () => {
    let resposta: DashboardResponse | undefined;

    service.consultar(null).subscribe(res => (resposta = res));

    const req = httpMock.expectOne(r =>
      r.method === 'GET' && r.url === baseUrl && !r.params.keys().length
    );

    const mockResponse: DashboardResponse = {
      carteiraFisica: [],
      carteiraFinanceira: [],
      evolucao: []
    };

    req.flush(mockResponse);

    expect(resposta).toEqual(mockResponse);
  });

  it('deve enviar parâmetros de filtro corretamente', () => {
    const filtro: DashboardFiltro = {
      dataInicio: '2025-12-01',
      dataFim: '2025-12-31',
      categoria: 'FINANCEIRO',
      status: 'ATIVO'
    };

    service.consultar(filtro).subscribe();

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === baseUrl);

    expect(req.request.params.get('dataInicio')).toBe('2025-12-01');
    expect(req.request.params.get('dataFim')).toBe('2025-12-31');
    expect(req.request.params.get('categoria')).toBe('FINANCEIRO');
    // status só vai se for diferente de TODOS
    expect(req.request.params.get('status')).toBe('ATIVO');

    req.flush({
      carteiraFisica: [],
      carteiraFinanceira: [],
      evolucao: []
    } as DashboardResponse);
  });
});
