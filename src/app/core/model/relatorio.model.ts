export type TipoRelatorio = 'TABELA' | 'KPI';

export type TipoParametro =
  | 'STRING'
  | 'NUMBER'
  | 'DATE'
  | 'DATETIME'
  | 'BOOLEAN'
  | 'LIST';

export interface ParametroRelatorio {
  nome: string;              // ex: dataInicial
  tipo: TipoParametro;       // DATE etc
  obrigatorio: boolean;
  defaultValue?: any;
  opcoes?: string[];         // se LIST
}

export interface Relatorio {
  id: number;
  nome: string;
  descricao?: string;
  tipo: TipoRelatorio;
  sqlTemplate?: string;
  parametros?: ParametroRelatorio[];
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ExecRequest {
  params: Record<string, any>;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ExecResponse {
  columns: Array<{ name: string; type?: string }>;
  rows: Array<Record<string, any>>;
  page?: { number: number; size: number; totalElements: number };
}

export interface ParametroRelatorioRequest {
  nome: string;
  tipo: TipoParametro;
  obrigatorio: boolean;
  defaultValue?: any;
  opcoes?: string[];
}

export interface RelatorioRequest {
  nome: string;
  descricao?: string;
  tipo: TipoRelatorio;
  sqlTemplate: string;
  parametros: ParametroRelatorioRequest[];
}
