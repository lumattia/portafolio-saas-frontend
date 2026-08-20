import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageRenderer, PageRequest } from '../models/page.model';
import { ViewModeService } from './view-mode.service';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly viewMode = inject(ViewModeService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/pages`;
  private readonly publishedApiUrl = `${environment.apiUrl}/public/published`;

  getByIdentifier(identifier?: string): Observable<PageRenderer> {
    const url = `${this.viewMode.isAdminMode() ? this.apiUrl : this.publishedApiUrl}/${identifier}`;
    return this.http.get<PageRenderer>(url);
  }

  create(request: PageRequest): Observable<PageRenderer> {
    return this.http.post<PageRenderer>(this.apiUrl, request);
  }
  update(id: string, request: PageRequest): Observable<PageRenderer> {
    const formData = new FormData();
    formData.append('json', JSON.stringify(request));
    request.sections?.forEach(s => {
      if (s.file) formData.append(`file_${s.id}`, s.file);
    });

    return this.http.put<PageRenderer>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  undoDelete(id: string): Observable<PageRenderer> {
    return this.http.post<PageRenderer>(`${this.apiUrl}/${id}/undo-delete`, {});
  }
}
