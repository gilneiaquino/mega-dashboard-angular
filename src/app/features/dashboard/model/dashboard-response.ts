import {BarItem, PieItem} from '../service/dashboard.service';

export interface DashboardResponse {
  carteiraFisica: PieItem[];
  carteiraFinanceira: PieItem[];
  evolucao: BarItem[];
}
