import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuRenderer, MenuRequest, MenuType } from '../models/menu.model';
import { ViewModeService } from './view-mode.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly viewMode = inject(ViewModeService);
  private readonly http = inject(HttpClient);
  private readonly adminApiUrl = `${environment.apiUrl}/admin/menu`;
  private readonly publishedApiUrl = `${environment.apiUrl}/public/published/menu`;

  getMenu(type: MenuType): Observable<MenuRenderer | null> {
    const url = `${this.viewMode.isAdminMode() ? this.adminApiUrl : this.publishedApiUrl}/${type}`;
    return this.http.get<MenuRenderer | null>(url);
  }

  create(request: MenuRequest): Observable<MenuRenderer> {
    return this.http.post<MenuRenderer>(`${this.adminApiUrl}`, request);
  }

  update(id: string, request: MenuRequest): Observable<MenuRenderer> {
    return this.http.put<MenuRenderer>(`${this.adminApiUrl}/${id}`, request)
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }
}
