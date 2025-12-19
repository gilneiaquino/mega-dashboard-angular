import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

type MenuItem = {
  label: string;
  path: string;
  roles?: string[]; // se vazio/undefined: qualquer logado vê
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-title">Navegação</div>

      <nav class="menu">
        <a
          *ngFor="let item of menuVisivel"
          [routerLink]="item.path"
          routerLinkActive="active"
          class="menu-item"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="spacer"></div>

      <button class="logout" type="button" (click)="logout()">Sair</button>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      background: #0f172a;
      border-right: 1px solid #1f2937;
      color: #e5e7eb;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sidebar-title {
      font-weight: 700;
      font-size: .9rem;
      color: #cbd5f5;
      margin-bottom: 6px;
    }
    .menu {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .menu-item {
      padding: 10px 10px;
      border-radius: 8px;
      text-decoration: none;
      color: #e5e7eb;
      border: 1px solid transparent;
      background: #020617;
    }
    .menu-item:hover {
      border-color: #22c55e;
    }
    .menu-item.active {
      border-color: #22c55e;
      box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.4);
    }
    .spacer { flex: 1; }
    .logout {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #374151;
      background: #020617;
      color: #e5e7eb;
      cursor: pointer;
    }
    .logout:hover {
      border-color: #f97373;
    }
  `]
})
export class AppSidebarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  private menu: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Relatórios', path: '/relatorios', roles: ['ADMIN'] }, // exemplo: só ADMIN
    { label: 'Configurações', path: '/configuracoes', roles: ['ADMIN'] }
  ];

  get menuVisivel(): MenuItem[] {
    const perfil = this.auth.getUsuario()?.perfil; // "ADMIN" | "USER"
    return this.menu.filter(item => !item.roles || (perfil ? item.roles.includes(perfil) : false));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
