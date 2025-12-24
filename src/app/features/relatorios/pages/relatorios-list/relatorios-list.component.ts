import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { RelatoriosService } from '../../../../core/services/relatorios.service';
import { PageResponse, Relatorio, TipoRelatorio } from '../../../../core/model/relatorio.model';

@Component({
  selector: 'app-relatorios-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './relatorios-list.component.html',
  styleUrls: ['./relatorios-list.component.scss'],
})
export class RelatoriosListComponent implements OnInit {
  private relatoriosService = inject(RelatoriosService);
  private router = inject(Router);

  // filtros
  q = new FormControl<string>('', { nonNullable: true });
  tipo = new FormControl<TipoRelatorio | ''>('', { nonNullable: true });

  // tabela/paginação
  loading = false;
  error = '';

  page = 0;
  size = 10;
  totalElements = 0;

  sort = 'nome,asc';

  relatorios: Relatorio[] = [];

  ngOnInit(): void {
    this.q.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.page = 0;
        this.carregar();
      });

    this.tipo.valueChanges.subscribe(() => {
      this.page = 0;
      this.carregar();
    });

    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.error = '';

    this.relatoriosService
      .listar({
        page: this.page,
        size: this.size,
        q: this.q.value?.trim() ?? '',
        tipo: this.tipo.value ?? '',
        sort: this.sort,
      })
      .subscribe({
        next: (res: PageResponse<Relatorio>) => {
          this.relatorios = res.content ?? [];
          this.totalElements = res.totalElements ?? 0;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Não foi possível carregar os relatórios.';
          this.loading = false;
          console.error(err);
        },
      });
  }

  ordenarPor(campo: 'nome' | 'tipo'): void {
    const [currentField, currentDir] = this.sort.split(',');
    const nextDir = currentField === campo && currentDir === 'asc' ? 'desc' : 'asc';
    this.sort = `${campo},${nextDir}`;
    this.carregar();
  }

  anterior(): void {
    if (this.page > 0) {
      this.page--;
      this.carregar();
    }
  }

  proximo(): void {
    const maxPage = Math.ceil(this.totalElements / this.size) - 1;
    if (this.page < maxPage) {
      this.page++;
      this.carregar();
    }
  }

  criar(): void {
    this.router.navigateByUrl('/relatorios/novo');
  }

  executar(r: Relatorio): void {
    this.router.navigateByUrl(`/relatorios/${r.id}/executar`);
  }

  editar(r: Relatorio): void {
    this.router.navigateByUrl(`/relatorios/${r.id}/editar`);
  }

  trackById(_: number, item: Relatorio): number {
    return item.id;
  }
}
