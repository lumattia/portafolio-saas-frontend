import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { EmailInputComponent, emailPattern } from '../../../../shared/components/inputs/text-input/email-input.component';
import { PasswordInputComponent } from '../../../../shared/components/inputs/password-input/password-input.component';
import { ViewModeService } from '../../../../core/services/view-mode.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, EmailInputComponent, PasswordInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly viewMode = inject(ViewModeService);
  private readonly router = inject(Router);

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.viewMode.setViewMode('draft');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err?.status === 429) {
          const retryAfter = Number(err.headers?.get('Retry-After'));
          const minutes = Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.ceil(retryAfter / 60)
            : 1;
          this.error.set(`Demasiados intentos. Espera ${minutes} min y vuelve a probar.`);
        } else {
          this.error.set('Credenciales inválidas.');
        }
      },
    });
  }
}
