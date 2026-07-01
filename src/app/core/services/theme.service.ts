import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ThemeConfig } from '../models/theme-config.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/public/theme`;
  readonly mode = signal<'light' | 'dark'>('light');
 
  toggle(): void {
    this.mode.update((value) => (value === 'light' ? 'dark' : 'light'));
  }

  getTheme(): Observable<ThemeConfig> {
    return this.http.get<ThemeConfig>(this.apiUrl);
  }

  get(): Observable<ThemeConfig> {
    return this.http.get<ThemeConfig>(`${environment.apiUrl}/admin/theme-config`);
  }

  update(request: ThemeConfig): Observable<ThemeConfig> {
    return this.http.put<ThemeConfig>(`${environment.apiUrl}/admin/theme-config`, request);
  }
}
