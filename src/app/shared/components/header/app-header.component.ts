import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="left">
        <span class="brand">Mega Dashboard</span>
      </div>

      <div class="right">
        <span class="user" *ngIf="usuario">
          {{ usuario.nome }} • {{ usuario.perfil }}
        </span>

        <button type="button" class="logout" (click)="logout()">
          Sair
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: #0f172a;
      color: #e5e7eb;
      border-bottom: 1px solid #1f2937;
    }

    .brand { font-weight: 700; }

    .right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user {
      font-size: 0.85rem;
      color: #cbd5f5;
      white-space: nowrap;
    }

    .logout {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #374151;
      background: #020617;
      color: #e5e7eb;
      cursor: pointer;
    }

    .logout:hover {
      border-color: #22c55e;
    }
  `]
})
export class AppHeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = this.auth.getUsuario();

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
