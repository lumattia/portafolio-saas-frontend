import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageRenderer } from '../models/page.model';
import { MenuRenderer } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class PublishedService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/public/published`;

  get(slug?: string): Observable<PageRenderer> {
    const params: any = {};
    const url = slug ? `${this.apiUrl}/${slug}` : this.apiUrl;
    return this.http.get<PageRenderer>(url, { params });
  }

  getMenu(type: string): Observable<MenuRenderer> {
    return this.http.get<MenuRenderer>(`${this.apiUrl}/menu/${type}`);
  }
}
