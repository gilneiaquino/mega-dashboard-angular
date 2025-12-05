import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, UsuarioLogado } from '../../core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private auth = inject(Auth);
  private router = inject(Router);

  usuario: UsuarioLogado | null = this.auth.getUsuario();

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
