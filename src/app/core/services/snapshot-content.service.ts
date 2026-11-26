import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageRenderer } from '../models/page.model';
import { MenuRenderer, MenuType } from '../models/menu.model';
import { ThemeConfig } from '../models/theme-config.model';

// Solo endpoints de versiones (admin): página, menú y tema en una versión concreta.
// version null = versión actual publicada (el backend aplica CurrentVersion)
@Injectable({ providedIn: 'root' })
export class SnapshotContentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/snapshot`;

  getPage(slug: string | undefined, version: number | null): Observable<PageRenderer> {
    const params = version != null ? new HttpParams().set('version', version) : undefined;
    return this.http.get<PageRenderer>(`${this.apiUrl}/page/${slug}`, { params });
  }

  getMenu(type: MenuType, version: number | null): Observable<MenuRenderer | null> {
    const params = version != null ? new HttpParams().set('version', version) : undefined;
    return this.http.get<MenuRenderer | null>(`${this.apiUrl}/menu/${type}`, { params });
  }

  getTheme(version: number | null): Observable<ThemeConfig> {
    const params = version != null ? new HttpParams().set('version', version) : undefined;
    return this.http.get<ThemeConfig>(`${this.apiUrl}/theme`, { params });
  }
}
