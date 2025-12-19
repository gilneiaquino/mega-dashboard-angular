import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Relatórios</h1>
      <p>Página de relatórios protegida por autenticação.</p>
    </section>
  `,
  styles: [`
    .page {
      padding: 1.5rem;
    }
  `]
})
export class RelatoriosComponent {}
