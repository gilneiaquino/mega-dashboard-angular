export type TipoRelatorio = 'TABELA' | 'KPI';

export interface Relatorio {
  id: number;
  nome: string;
  descricao?: string;
  tipo: TipoRelatorio;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // page atual (0-based)
  size: number;
}
