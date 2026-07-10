import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userSignal = signal<User | null>(this.loadStoredUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isPlatformAdmin = computed(() => this.userSignal()?.role === 'PlatformAdmin');
  readonly isTenantOwner = computed(() => this.userSignal()?.role === 'TenantOwner');

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    this.userSignal.set(null)
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('viewMode');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  registerTenant(email: string, password: string, configuredDomain: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register-tenant`, {
      email,
      password,
      configuredDomain,
    });
  }

  getMe(): void {
    if (!this.getToken()) {
      this.logout();
      return;
    }

    this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap((res) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.userSignal.set(res);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    ).subscribe();
  }

  private persistSession(response: LoginResponse): void {
    localStorage.setItem('access_token', response.token);
    const user: User = {
      tenantId: response.tenantId,
      email: response.email,
      role: response.role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.userSignal.set(user);
  }

  private loadStoredUser(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
