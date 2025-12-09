export interface DashboardFiltro {
  dataInicio?: string | null;
  dataFim?: string | null;
  categoria?: string | null;
  status?: 'TODOS' | 'ATIVO' | 'INATIVO' | null;
}
