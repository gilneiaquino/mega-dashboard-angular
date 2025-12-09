import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {DashboardFiltro} from '../model/dashboard-filtro';
import {DashboardResponse} from '../model/dashboard-response';

export interface PieItem {
  label: string;
  value: number;
}

export interface BarSeriesItem {
  label: string;
  value: number;
}

export interface BarItem {
  label: string;
  series: BarSeriesItem[];
}



@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dashboard`;

  consultar(filtro?: DashboardFiltro | null): Observable<DashboardResponse> {
    let params = new HttpParams();

    if (filtro?.dataInicio) {
      params = params.set('dataInicio', filtro.dataInicio);
    }
    if (filtro?.dataFim) {
      params = params.set('dataFim', filtro.dataFim);
    }
    if (filtro?.categoria) {
      params = params.set('categoria', filtro.categoria);
    }
    if (filtro?.status && filtro.status !== 'TODOS') {
      params = params.set('status', filtro.status);
    }

    return this.http.get<DashboardResponse>(this.baseUrl, { params });
  }
}
