import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageRenderer } from '../models/page.model';
import { MenuRenderer, MenuType } from '../models/menu.model';
import { ThemeConfig } from '../models/theme-config.model';

// Solo endpoints públicos: este servicio no puede alcanzar rutas admin
@Injectable({ providedIn: 'root' })
export class PublishedContentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/public/published`;

  getPage(slug?: string): Observable<PageRenderer> {
    return this.http.get<PageRenderer>(`${this.apiUrl}/${slug}`);
  }

  getMenu(type: MenuType): Observable<MenuRenderer | null> {
    return this.http.get<MenuRenderer | null>(`${this.apiUrl}/menu/${type}`);
  }

  getTheme(): Observable<ThemeConfig> {
    return this.http.get<ThemeConfig>(`${this.apiUrl}/theme`);
  }
}
