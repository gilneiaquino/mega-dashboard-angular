import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="wrap">
      <div class="card">
        <h1>Acesso negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>

        <div class="actions">
          <a class="btn" routerLink="/dashboard">Voltar para o Dashboard</a>

          <button class="btn outline" type="button" (click)="logout()">
            Sair
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .wrap {
      min-height: calc(100vh - 56px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .card {
      width: 100%;
      max-width: 520px;
      background: #0f172a;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 24px;
      color: #e5e7eb;
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
      text-align: center;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 1.35rem;
      font-weight: 700;
    }
    p {
      margin: 0 0 18px;
      color: #cbd5f5;
      font-size: .95rem;
      line-height: 1.4;
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid transparent;
      text-decoration: none;
      cursor: pointer;
      font-weight: 600;
      background: #22c55e;
      color: #020617;
    }
    .btn:hover {
      background: #16a34a;
    }
    .btn.outline {
      background: #020617;
      color: #e5e7eb;
      border-color: #374151;
    }
    .btn.outline:hover {
      border-color: #f97373;
    }
  `]
})
export class ForbiddenComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
