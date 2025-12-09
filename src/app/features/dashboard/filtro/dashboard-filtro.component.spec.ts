import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardFiltro } from '../model/dashboard-filtro';
import {DashboardFiltroComponent} from './dashboardFiltroComponent';

describe('DashboardFiltroComponent', () => {
  let component: DashboardFiltroComponent;
  let fixture: ComponentFixture<DashboardFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFiltroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFiltroComponent);
    component = fixture.componentInstance;
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o form com valorInicial quando informado', () => {
    const valorInicial: DashboardFiltro = {
      dataInicio: '2025-12-01',
      dataFim: '2025-12-31',
      categoria: 'FINANCEIRO',
      status: 'ATIVO'
    };

    component.valorInicial = valorInicial;

    fixture.detectChanges(); // dispara ngOnInit

    expect(component.form.value).toEqual(valorInicial);
  });

  it('deve emitir o filtro ao chamar onPesquisar()', () => {
    fixture.detectChanges(); // cria form

    const filtroForm: DashboardFiltro = {
      dataInicio: '2025-12-01',
      dataFim: '2025-12-31',
      categoria: 'VENDAS',
      status: 'TODOS'
    };

    component.form.setValue(filtroForm);

    let emitido: DashboardFiltro | undefined;
    component.pesquisar.subscribe(f => (emitido = f));

    component.onPesquisar();

    expect(emitido).toEqual(filtroForm);
  });
});
