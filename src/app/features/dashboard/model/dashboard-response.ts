import {BarItem} from '../../../core/model/bar-item';
import {PieItem} from '../../../core/model/pieI-item';

export interface DashboardResponse {
  carteiraFisica: PieItem[];
  carteiraFinanceira: PieItem[];
  evolucao: BarItem[];
}
