import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Configurações</h1>
      <p>Página de configurações protegida por autenticação.</p>
    </section>
  `,
  styles: [`
    .page {
      padding: 1.5rem;
    }
  `]
})
export class ConfigComponent {}
