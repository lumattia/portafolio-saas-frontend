import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userSignal = signal<User | null>(this.loadStoredUser());
  private refreshRequest$?: Observable<boolean>;

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isPlatformAdmin = computed(() => this.userSignal()?.role === 'PlatformAdmin');
  readonly isTenantOwner = computed(() => this.userSignal()?.role === 'TenantOwner');

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.persistSession(res)));
  }

  // Single-flight: llamadas concurrentes comparten la misma petición de refresh
  refreshSession(): Observable<boolean> {
    this.refreshRequest$ ??= this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, {
        refreshToken: localStorage.getItem('refresh_token'),
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.token);
          localStorage.setItem('refresh_token', res.refreshToken);
        }),
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        }),
        finalize(() => {
          this.refreshRequest$ = undefined;
        }),
        shareReplay(1)
      );
    return this.refreshRequest$;
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      this.http
        .post(`${environment.apiUrl}/auth/logout`, { refreshToken })
        .subscribe({ error: () => {} });
    }
    this.userSignal.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('viewMode');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
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
    localStorage.setItem('refresh_token', response.refreshToken);
    const user: User = {
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
