import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {RelatoriosService} from '../../../../core/services/relatorios.service';
import {
  ParametroRelatorio,
  RelatorioRequest,
  TipoParametro,
  TipoRelatorio
} from '../../../../core/model/relatorio.model';
import {map, of, switchMap} from 'rxjs';

@Component({
  selector: 'app-relatorio-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './relatorio-form.component.html',
  styleUrls: ['./relatorio-form.component.scss'],
})
export class RelatorioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(RelatoriosService);

  id: number | null = null;
  loading = false;
  saving = false;
  error = '';

  tiposRelatorio: TipoRelatorio[] = ['TABELA', 'KPI'];
  tiposParametro: TipoParametro[] = ['STRING', 'NUMBER', 'DATE', 'DATETIME', 'BOOLEAN', 'LIST'];
  form = this.fb.group({
    nome: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    descricao: this.fb.control<string>(''),
    tipo: this.fb.control<TipoRelatorio>('TABELA', {nonNullable: true}),
    sqlTemplate: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)]
    }),
    parametros: this.fb.array<FormGroup>([])
  });

  get parametros(): FormArray<FormGroup> {
    return this.form.get('parametros') as FormArray<FormGroup>;
  }


  ngOnInit(): void {
    // reage a mudanças de rota sem depender de snapshot
    this.route.paramMap
      .pipe(
        map(pm => pm.get('id')),
        switchMap(idStr => {
          this.error = '';
          this.parametros.clear();

          if (!idStr) {
            // modo NOVO
            this.id = null;
            this.form.reset({
              nome: '',
              descricao: '',
              tipo: 'TABELA',
              sqlTemplate: '',
              parametros: []
            });
            return of(null);
          }

          // modo EDITAR
          this.id = Number(idStr);
          this.loading = true;
          return this.service.buscarPorId(this.id);
        })
      )
      .subscribe({
        next: (r) => {
          if (!r) return;

          this.form.patchValue({
            nome: r.nome,
            descricao: r.descricao ?? '',
            tipo: r.tipo,
            sqlTemplate: r.sqlTemplate ?? '',
          });

          (r.parametros ?? []).forEach(p => this.parametros.push(this.criarParamGroup(p)));

          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.error = 'Não foi possível carregar o relatório.';
          this.loading = false;
        }
      });
  }

  criarParamGroup(p?: Partial<ParametroRelatorio>): FormGroup {
    return this.fb.group({
      nome: this.fb.control(p?.nome ?? '', [Validators.required, Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)]),
      tipo: this.fb.control<TipoParametro>((p?.tipo as TipoParametro) ?? 'STRING', {nonNullable: true}),
      obrigatorio: this.fb.control(!!p?.obrigatorio, {nonNullable: true}),
      defaultValue: this.fb.control(p?.defaultValue ?? null),
      opcoes: this.fb.control((p?.opcoes ?? []).join(',')), // UI simples: csv
    });
  }

  adicionarParametro(): void {
    this.parametros.push(this.criarParamGroup());
  }

  removerParametro(idx: number): void {
    this.parametros.removeAt(idx);
  }

  salvar(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Revise os campos obrigatórios.';
      return;
    }

    const raw = this.form.getRawValue();

    const dto: RelatorioRequest = {
      nome: raw.nome.trim(),
      descricao: raw.descricao?.trim() ?? '',
      tipo: raw.tipo,
      sqlTemplate: raw.sqlTemplate!,
      parametros: raw.parametros.map((p: any) => ({
        nome: String(p.nome).trim(),
        tipo: p.tipo,
        obrigatorio: !!p.obrigatorio,
        defaultValue: p.defaultValue,
        opcoes: p.tipo === 'LIST'
          ? String(p.opcoes ?? '')
            .split(',')
            .map((x: string) => x.trim())
            .filter(Boolean)
          : undefined,
      })),
    };

    this.saving = true;

    const req$ = this.id
      ? this.service.atualizar(this.id, dto)
      : this.service.criar(dto);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl('/relatorios');
      },
      error: (e) => {
        console.error(e);
        this.error = 'Não foi possível salvar o relatório.';
        this.saving = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigateByUrl('/relatorios');
  }
}
