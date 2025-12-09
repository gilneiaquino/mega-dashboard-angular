import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DashboardFiltro} from '../../../core/model/dashboard-filtro';

@Component({
  selector: 'app-dashboard-filtro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './DashboardFiltroComponent.html',
  styleUrl: './DashboardFiltroComponent.scss'
})
export class DashboardFiltroComponent implements OnInit {

  @Input() valorInicial?: DashboardFiltro | null;
  @Output() pesquisar = new EventEmitter<DashboardFiltro>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dataInicio: [this.valorInicial?.dataInicio ?? null],
      dataFim: [this.valorInicial?.dataFim ?? null],
      categoria: [this.valorInicial?.categoria ?? null],
      status: [this.valorInicial?.status ?? 'TODOS']
    });
  }

  onSubmit(): void {
    const filtro: DashboardFiltro = this.form.getRawValue();
    this.pesquisar.emit(filtro);
  }

  limpar(): void {
    this.form.reset({
      dataInicio: null,
      dataFim: null,
      categoria: null,
      status: 'TODOS'
    });
    this.pesquisar.emit(this.form.getRawValue());
  }
}
