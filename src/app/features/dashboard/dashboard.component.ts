import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import {DashboardFiltroComponent} from './filtro/dashboardFiltroComponent';
import {DashboardService} from './services/dashboard.service';
import {DashboardResponse} from './model/dashboard-response';
import {DashboardFiltro} from './model/dashboard-filtro';
import {DashboardCardComponent} from './shared/dashboard-card.component';
import {AppHeaderComponent} from '../../shared/components/header/app-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    NgxChartsModule,
    DashboardFiltroComponent,
    DashboardCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  filtroAtual: DashboardFiltro | null = null;

  // estado de tela
  loading = false;
  erro: string | null = null;

  // tamanho dos gráficos
  view: [number, number] = [600, 300];

  // dados (ngx-charts)
  dadosCarteiraFisica: { name: string; value: number }[] = [];
  dadosCarteiraFinanceira: { name: string; value: number }[] = [];
  dadosEvolucao: { name: string; series: { name: string; value: number }[] }[] = [];

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    // Se quiser carregar algo default (exemplo):
    // this.onPesquisar({ dataInicio: '2025-01-01', dataFim: '2025-01-31', status: 'TODOS' });
  }

  onPesquisar(filtro: DashboardFiltro | null): void {
    this.filtroAtual = filtro;
    this.carregarDashboard(filtro);
  }

  private carregarDashboard(filtro: DashboardFiltro | null): void {
    this.loading = true;
    this.erro = null;

    // zera antes pra UI reagir (opcional)
    this.dadosCarteiraFisica = [];
    this.dadosCarteiraFinanceira = [];
    this.dadosEvolucao = [];

    // ✅ IMPORTANTE:
    // Você precisa ter no service um método "consultarResumo"
    // que chame /api/dashboards/resumo (ou o endpoint real de gráficos)
    this.dashboardService.consultarResumo(filtro).subscribe({
      next: (res: DashboardResponse) => {
        // Sempre criar novos arrays (ngx-charts é sensível a referência)
        this.dadosCarteiraFisica = (res?.carteiraFisica ?? []).map(item => ({
          name: item.label,
          value: item.value
        })).slice();

        this.dadosCarteiraFinanceira = (res?.carteiraFinanceira ?? []).map(item => ({
          name: item.label,
          value: item.value
        })).slice();

        this.dadosEvolucao = (res?.evolucao ?? []).map(bar => ({
          name: bar.label,
          series: (bar.series ?? []).map(serie => ({
            name: serie.label,
            value: serie.value
          }))
        })).slice();

        // debug rápido (remova depois)
        // console.log('fisica', this.dadosCarteiraFisica);
        // console.log('financeira', this.dadosCarteiraFinanceira);
        // console.log('evolucao', this.dadosEvolucao);

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);

        // aqui fica bem claro o problema atual:
        // seu backend está devolvendo Page em /api/dashboards
        // e a tela precisa do endpoint /resumo para os gráficos
        this.erro =
          'Não foi possível carregar os gráficos. ' +
          'Verifique se o backend expõe /api/dashboards/resumo retornando DashboardResponse.';

        this.dadosCarteiraFisica = [];
        this.dadosCarteiraFinanceira = [];
        this.dadosEvolucao = [];
        this.loading = false;
      }
    });
  }
}
