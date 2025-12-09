import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Dashboard } from './dashboard';
import { DashboardService } from './service/dashboard.service';
import { DashboardResponse } from './model/dashboard-response';
import { DashboardFiltro } from './model/dashboard-filtro';

describe('Dashboard (component)', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  const mockResponse: DashboardResponse = {
    carteiraFisica: [
      { label: 'Adimplente', value: 80 },
      { label: 'Inadimplente', value: 20 }
    ],
    carteiraFinanceira: [
      { label: 'Adimplente', value: 70 },
      { label: 'Inadimplente', value: 30 }
    ],
    evolucao: [
      {
        label: 'Jan',
        series: [
          { label: 'Contratos', value: 10 },
          { label: 'Valor (R$ mil)', value: 80 }
        ]
      }
    ]
  };

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj<DashboardService>('DashboardService', ['consultar']);

    await TestBed.configureTestingModule({
      imports: [Dashboard], // standalone
      providers: [
        { provide: DashboardService, useValue: dashboardServiceSpy } // 👈 mocka o service
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service.consultar and populate charts on search', () => {
    const filtro: DashboardFiltro = {
      dataInicio: '2025-12-01',
      dataFim: '2025-12-31',
      categoria: null,
      status: 'TODOS'
    };

    dashboardServiceSpy.consultar.and.returnValue(of(mockResponse));

    component.onPesquisar(filtro);

    expect(dashboardServiceSpy.consultar).toHaveBeenCalledWith(filtro);
    expect(component.loading).toBeFalse();
    expect(component.erro).toBeNull();

    expect(component.dadosCarteiraFisica.length).toBe(2);
    expect(component.dadosCarteiraFisica[0]).toEqual({ name: 'Adimplente', value: 80 });
  });

  it('should handle error from service and clear data', () => {
    const filtro: DashboardFiltro = {};
    dashboardServiceSpy.consultar.and.returnValue(
      throwError(() => new Error('erro qualquer'))
    );

    component.onPesquisar(filtro);

    expect(dashboardServiceSpy.consultar).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.erro).toBe('Erro ao carregar dados do dashboard.');
    expect(component.dadosCarteiraFisica.length).toBe(0);
    expect(component.dadosCarteiraFinanceira.length).toBe(0);
    expect(component.dadosEvolucao.length).toBe(0);
  });
});
