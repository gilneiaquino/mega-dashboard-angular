import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { RelatoriosService } from '../../../../core/services/relatorios.service';
import { ExecResponse, ParametroRelatorio, Relatorio } from '../../../../core/model/relatorio.model';

@Component({
  selector: 'app-relatorio-executar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './relatorio-executar.component.html',
  styleUrls: ['./relatorio-executar.component.scss'],
})
export class RelatorioExecutarComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private service = inject(RelatoriosService);

  id!: number;

  loading = false;
  running = false;
  error = '';

  relatorio: Relatorio | null = null;

  filtrosForm!: FormGroup;

  // tabela resultado
  result: ExecResponse | null = null;
  page = 0;
  size = 20;
  sort = '';

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.loading = true;
    this.service.buscarPorId(this.id).subscribe({
      next: (r) => {
        this.relatorio = r;
        this.filtrosForm = this.montarForm(r.parametros ?? []);
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'Não foi possível carregar o relatório.';
        this.loading = false;
      },
    });
  }

  montarForm(params: ParametroRelatorio[]): FormGroup {
    const group: Record<string, FormControl<any>> = {};
    for (const p of params) {
      group[p.nome] = this.fb.control(p.defaultValue ?? null);
    }
    return this.fb.group(group);
  }

  executar(resetPage = true): void {
    if (!this.relatorio) return;

    if (resetPage) this.page = 0;
    this.running = true;
    this.error = '';

    const params = this.filtrosForm.getRawValue();

    this.service.executar(this.relatorio.id, {
      params,
      page: this.page,
      size: this.size,
      sort: this.sort || undefined,
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.running = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'Erro ao executar o relatório.';
        this.running = false;
      }
    });
  }

  get columns(): string[] {
    return this.result?.columns?.map(c => c.name) ?? [];
  }

  anterior(): void {
    if (this.page > 0) {
      this.page--;
      this.executar(false);
    }
  }

  proximo(): void {
    const total = this.result?.page?.totalElements ?? 0;
    if ((this.page + 1) * this.size < total) {
      this.page++;
      this.executar(false);
    }
  }

  exportarCsv(): void {
    if (!this.result) return;
    const cols = this.columns;

    const escape = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const lines = [
      cols.join(';'),
      ...this.result.rows.map(row => cols.map(c => escape(row[c])).join(';'))
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.relatorio?.nome ?? 'relatorio'}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  ordenar(col: string): void {
    // alterna asc/desc
    const [c, d] = (this.sort || '').split(',');
    const nextDir = (c === col && d === 'asc') ? 'desc' : 'asc';
    this.sort = `${col},${nextDir}`;
    this.executar(false);
  }
}
