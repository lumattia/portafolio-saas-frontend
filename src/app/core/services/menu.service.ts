import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuItem } from '../models/menu.model';
import { MenuRequest } from '../models/menu.model';
import { ViewModeService } from './view-mode.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly viewMode = inject(ViewModeService);
  private readonly publicApiUrl = `${environment.apiUrl}/public/menu`;
  private readonly adminApiUrl = `${environment.apiUrl}/admin/menu`;
  
  readonly menus = signal<MenuItem[]>([]);

  getMenu(): Observable<MenuItem[]> {
    let api = this.viewMode.isAdminMode() ? this.adminApiUrl : this.publicApiUrl;
    return this.http.get<MenuItem[]>(api).pipe(
      tap({
        next: (menus) => this.menus.set(menus),
        error: (err) => console.error('Failed to load menu', err)
      }))
  }

  create(request: MenuRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.adminApiUrl, request).pipe(
      tap({
        next: (created) => this.menus.update(m => [...m, created]),
        error: (err) => console.error('Failed to create menu item', err)
      })
    );
  }

  update(id: string, request: MenuRequest): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.adminApiUrl}/${id}`, request).pipe(
      tap({
        next: (updated) => this.menus.update(m => m.map(item => item.id === id ? updated : item)),
        error: (err) => console.error('Failed to update menu item', err)
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`).pipe(
      tap({
        next: () => this.menus.update(m => m.filter(item => item.id !== id)),
        error: (err) => console.error('Failed to delete menu item', err)
      })
    );
  }

  reorder(menuIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.adminApiUrl}/reorder`, menuIds);
  }
}