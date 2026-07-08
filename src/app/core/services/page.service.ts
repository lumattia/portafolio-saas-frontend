import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageRenderer, PageRequest } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/pages`;
  
  getByIdentifier(identifier?: string): Observable<PageRenderer> {
    return this.http.get<PageRenderer>(`${this.apiUrl}/${identifier}`);
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
  publish(): Observable<PageRenderer> {
    return this.http.post<PageRenderer>(`${this.apiUrl}/publish`, {});
  }
}
