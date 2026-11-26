import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Color, ThemeConfig } from '../models/theme-config.model';
import { ViewModeService } from './view-mode.service';
import { PublishedContentService } from './published-content.service';
import { SnapshotContentService } from './snapshot-content.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly http = inject(HttpClient);
  private readonly viewMode = inject(ViewModeService);
  private readonly publishedContent = inject(PublishedContentService);
  private readonly snapshotContent = inject(SnapshotContentService);

  readonly mode = signal<'light' | 'dark'>(this.loadStoredMode());
  private readonly config = signal<ThemeConfig | null>(null);
  private themeSub?: Subscription;
  private skipInitialThemeLoad = true;

  constructor() {
    effect(() => {
      const cfg = this.config();
      if (cfg) this.apply(cfg[this.mode()]);
    });
    effect(() => {
      this.viewMode.viewMode();
      this.viewMode.snapshotVersion();
      if (this.skipInitialThemeLoad) {
        this.skipInitialThemeLoad = false;
        return;
      }
      this.themeSub?.unsubscribe();
      this.themeSub = this.loadTheme().subscribe();
    });
  }

  loadTheme(): Observable<ThemeConfig> {
    const request = this.viewMode.isDraftMode()
      ? this.http.get<ThemeConfig>(`${environment.apiUrl}/public/theme`)
      : this.viewMode.isSnapshotMode()
        ? this.snapshotContent.getTheme(this.viewMode.snapshotVersion())
        : this.publishedContent.getTheme();
    return request.pipe(tap((theme) => this.config.set(theme)));
  }

  toggle(): void {
    this.mode.update((value) => (value === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme_mode', this.mode());
  }

  get(): Observable<ThemeConfig> {
    return this.http.get<ThemeConfig>(`${environment.apiUrl}/admin/theme-config`);
  }

  update(request: ThemeConfig): Observable<ThemeConfig> {
    return this.http.put<ThemeConfig>(`${environment.apiUrl}/admin/theme-config`, request);
  }

  private apply(colors: Color): void {
    const root = document.documentElement;
    root.dataset['theme'] = this.mode();
    root.style.setProperty('--primary', colors.primaryColor);
    root.style.setProperty('--secondary', colors.secondaryColor);
    root.style.setProperty('--bg', colors.backgroundColor);
    root.style.setProperty('--surface', colors.surfaceColor);
    root.style.setProperty('--text', colors.textColor);
    root.style.setProperty('--text-secondary', colors.textSecondaryColor);
    root.style.setProperty('--font-family', colors.fontFamily);
    root.style.setProperty('--border-radius', colors.borderRadius);
  }

  private loadStoredMode(): 'light' | 'dark' {
    const stored = localStorage.getItem('theme_mode');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
