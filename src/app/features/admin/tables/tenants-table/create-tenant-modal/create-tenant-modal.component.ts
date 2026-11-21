import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenantService } from '../../../../../core/services/tenant.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { EmailInputComponent, emailPattern } from '../../../../../shared/components/inputs/text-input/email-input.component';
import { PasswordInputComponent } from '../../../../../shared/components/inputs/password-input/password-input.component';
import { TextInputComponent } from '../../../../../shared/components/inputs/text-input/text-input.component';

@Component({
  selector: 'app-create-tenant-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, EmailInputComponent, PasswordInputComponent, TextInputComponent],
  templateUrl: './create-tenant-modal.component.html',
  styleUrl: './create-tenant-modal.component.scss',
})
export class CreateTenantModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly tenantService = inject(TenantService);

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    configuredDomain: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password, configuredDomain } = this.form.getRawValue();
    this.tenantService.createTenant(email, password, configuredDomain).subscribe({
      next: () => {
        this.loading.set(false);
        this.close?.(true);
      },
      error: (err) => {
        this.loading.set(false);
        const serverMessage = typeof err?.error === 'string' ? err.error : err?.error?.message;
        this.error.set(serverMessage ?? 'No se pudo registrar. Email o dominio duplicado.');
      },
    });
  }

  onCancel(): void {
    this.dismiss?.(false);
  }
}
