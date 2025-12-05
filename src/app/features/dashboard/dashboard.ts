import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  // tamanho dos gráficos (pode ajustar depois)
  view: [number, number] = [500, 300];

  // gráfico 1 – carteira física (exemplo)
  graficoFisico = [
    { name: 'Adimplente', value: 120 },
    { name: 'Inadimplente', value: 30 }
  ];

  // gráfico 2 – carteira financeira (exemplo)
  graficoFinanceiro = [
    { name: 'Adimplente', value: 150000 },
    { name: 'Inadimplente', value: 25000 }
  ];

  // gráfico 3 – evolução (exemplo)
  graficoEvolucao = [
    {
      name: 'Contratos',
      series: [
        { name: 'Jan', value: 10 },
        { name: 'Fev', value: 15 },
        { name: 'Mar', value: 20 }
      ]
    },
    {
      name: 'Valor (R$ mil)',
      series: [
        { name: 'Jan', value: 80 },
        { name: 'Fev', value: 120 },
        { name: 'Mar', value: 160 }
      ]
    }
  ];

  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  xAxisLabel = 'Mês';
  yAxisLabel = 'Quantidade';
}
