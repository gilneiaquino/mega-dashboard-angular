import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardFiltroComponent as DashboardFiltroComponent } from './filtro/dashboardFiltroComponent';
 import { DashboardService } from './services/dashboard.service';
import {DashboardResponse} from './model/dashboard-response';
import {DashboardFiltro} from './model/dashboard-filtro';
import { DashboardCardComponent } from './shared/dashboard-card.component';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,AppHeaderComponent, NgxChartsModule, DashboardFiltroComponent, DashboardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  filtroAtual: DashboardFiltro | null = null;

  // estado de tela
  loading = false;
  erro: string | null = null;

  // exemplo de dados para ngx-charts
  view: [number, number] = [600, 300];

  // gráfico de pizza – situação da carteira
  dadosCarteira: { name: string; value: number }[] = [];

  // gráfico de barras – operações por estágio
  dadosOperacoes: { name: string; value: number }[] = [];
  // para os gráficos de pizza
  dadosCarteiraFisica: { name: string; value: number }[] = [];
  dadosCarteiraFinanceira: { name: string; value: number }[] = [];

// para o gráfico de barras com séries
  dadosEvolucao: { name: string; series: { name: string; value: number }[] }[] = [];


  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // se quiser já carregar algo padrão, tipo filtro com data atual, setar aqui
    // this.filtroAtual = { ... };
    // if (this.filtroAtual) this.carregarDashboard(this.filtroAtual);
  }

  onPesquisar(filtro: DashboardFiltro | null): void {
    this.filtroAtual = filtro;
    this.carregarDashboard(filtro);
  }

  private carregarDashboard(filtro: DashboardFiltro | null): void {
    this.loading = true;
    this.erro = null;

    this.dashboardService.consultar(filtro).subscribe({
      next: (res: DashboardResponse) => {

        // Pie – carteira física
        this.dadosCarteiraFisica = (res.carteiraFisica || []).map(item => ({
          name: item.label,
          value: item.value
        }));

        // Pie – carteira financeira
        this.dadosCarteiraFinanceira = (res.carteiraFinanceira || []).map(item => ({
          name: item.label,
          value: item.value
        }));

        // Bar – evolução (com séries)
        this.dadosEvolucao = (res.evolucao || []).map(bar => ({
          name: bar.label,
          series: (bar.series || []).map(serie => ({
            name: serie.label,
            value: serie.value
          }))
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
        this.erro = 'Erro ao carregar dados do dashboard.';
        this.dadosCarteiraFisica = [];
        this.dadosCarteiraFinanceira = [];
        this.dadosEvolucao = [];
        this.loading = false;
      }
    });
  }
}
