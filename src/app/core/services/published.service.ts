import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublishedSnapshotPageDto } from '../models/published-snapshot.model';
import { MenuSnapshotDto } from '../models/menu.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PublishedService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/public/published`;

  get(slug?: string): Observable<PublishedSnapshotPageDto> {
    const params: any = {};
    const url = slug ? `${this.apiUrl}/${slug}` : this.apiUrl;
    return this.http.get<PublishedSnapshotPageDto>(url, { params });
  }

  getMenu(type: string): Observable<MenuSnapshotDto> {
    return this.http.get<MenuSnapshotDto>(`${this.apiUrl}/menu/${type}`);
  }
}
