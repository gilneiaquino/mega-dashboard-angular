import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    tenant: ['empresa-x', Validators.required] // por enquanto fixo ou options
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password, tenant } = this.form.value;

    this.auth.login({
      username: username!,
      password: password!,
      tenant: tenant!
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Usuário, senha ou empresa inválidos.';
      }
    });
  }
}
