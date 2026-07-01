import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-register-tenant-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent],
  templateUrl: './register-tenant-page.component.html',
  styleUrl: './register-tenant-page.component.css',
})
export class RegisterTenantPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    configuredDomain: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.message.set(null);
    this.error.set(null);

    const { email, password, configuredDomain } = this.form.getRawValue();
    this.auth.registerTenant(email, password, configuredDomain).subscribe({
      next: () => {
        this.loading.set(false);
        this.message.set(`Tenant creado: ${configuredDomain}`);
        this.form.reset();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo registrar. Email o dominio duplicado.');
      },
    });
  }
}
