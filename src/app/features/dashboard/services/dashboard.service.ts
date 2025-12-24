import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardFiltro } from '../model/dashboard-filtro';
import { DashboardResponse } from '../model/dashboard-response';
import { PageResponse, DashboardItem } from '../model/dashboard-page.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dashboards`;

  // ✅ endpoint que você tem HOJE (retorna Page)
  listar(page = 0, size = 20): Observable<PageResponse<DashboardItem>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<PageResponse<DashboardItem>>(this.baseUrl, { params });
  }

  // ✅ endpoint para os GRÁFICOS (você precisa ter no backend)
  // sugiro criar /api/dashboards/resumo
  consultarResumo(filtro?: DashboardFiltro | null): Observable<DashboardResponse> {
    let params = new HttpParams();

    if (filtro?.dataInicio) params = params.set('dataInicio', filtro.dataInicio);
    if (filtro?.dataFim) params = params.set('dataFim', filtro.dataFim);
    if (filtro?.categoria) params = params.set('categoria', filtro.categoria);
    if (filtro?.status && filtro.status !== 'TODOS') params = params.set('status', filtro.status);

    return this.http.get<DashboardResponse>(`${this.baseUrl}/resumo`, { params });
  }
}
