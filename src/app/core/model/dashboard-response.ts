import {BarItem, PieItem} from '../services/dashboard.service';

export interface DashboardResponse {
  carteiraFisica: PieItem[];
  carteiraFinanceira: PieItem[];
  evolucao: BarItem[];
}
