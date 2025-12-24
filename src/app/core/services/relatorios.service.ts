import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse, Relatorio } from '../model/relatorio.model';

@Injectable({ providedIn: 'root' })
export class RelatoriosService {
  private readonly baseUrl = '/api/relatorios';

  constructor(private http: HttpClient) {}

  listar(params: {
    page?: number;
    size?: number;
    q?: string;
    tipo?: 'TABELA' | 'KPI' | '';
    sort?: string; // ex: 'nome,asc'
  }): Observable<PageResponse<Relatorio>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page ?? 0))
      .set('size', String(params.size ?? 10));

    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.tipo) httpParams = httpParams.set('tipo', params.tipo);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);

    return this.http.get<PageResponse<Relatorio>>(this.baseUrl, { params: httpParams });
  }

  buscarPorId(id: number): Observable<Relatorio> {
    return this.http.get<Relatorio>(`${this.baseUrl}/${id}`);
  }
}
