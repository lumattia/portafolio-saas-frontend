import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageFilters, PageRenderer, PageRequest, PageTableItem } from '../models/page.model';
import { PagedList, PagedParameters } from '../models/common.models';
import { ViewModeService } from './view-mode.service';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly viewMode = inject(ViewModeService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/pages`;
  private readonly publishedApiUrl = `${environment.apiUrl}/public/published`;

  getPages(parameters?: PagedParameters, filters?: PageFilters): Observable<PagedList<PageTableItem>> {
    let params = parameters?.toHttpParams() ?? new HttpParams();

    if (filters?.slug) params = params.set('slug', filters.slug);
    if (filters?.title) params = params.set('title', filters.title);
    if (filters?.toPublish != null) params = params.set('toPublish', filters.toPublish.toString());
    if (filters?.isPublished != null) params = params.set('isPublished', filters.isPublished.toString());
    if (filters?.isDeleted != null) params = params.set('isDeleted', filters.isDeleted.toString());
    if (filters?.disabled != null) params = params.set('disabled', filters.disabled.toString());

    return this.http.get<PagedList<PageTableItem>>(`${this.apiUrl}/table`, { params });
  }

  getByIdentifier(identifier?: string): Observable<PageRenderer> {
    const url = `${this.viewMode.isDraftMode() ? this.apiUrl : this.publishedApiUrl}/${identifier}`;
    return this.http.get<PageRenderer>(url);
  }

  create(request: PageRequest): Observable<PageRenderer> {
    return this.http.post<PageRenderer>(this.apiUrl, request);
  }
  update(id: string, request: PageRequest): Observable<PageRenderer> {
    return this.http.put<PageRenderer>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  undoDelete(id: string): Observable<PageRenderer> {
    return this.http.post<PageRenderer>(`${this.apiUrl}/${id}/undo-delete`, {});
  }
}
