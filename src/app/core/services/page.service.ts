import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageDetailDto, PageDto, PageRequest } from '../models/page.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/pages`;

  getAll(): Observable<PageDto[]> {
    return this.http.get<PageDto[]>(this.apiUrl);
  }

  getByIdentifier(identifier?: string): Observable<PageDetailDto> {
    return this.http.get<PageDetailDto>(`${this.apiUrl}/${identifier}`);
  }

  create(request: PageRequest): Observable<PageDto> {
    return this.http.post<PageDto>(this.apiUrl, request);
  }

  update(id: string, request: PageRequest): Observable<PageDetailDto> {
    return this.http.put<PageDetailDto>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publish(id: string): Observable<PageDetailDto> {
    return this.http.post<PageDetailDto>(`${this.apiUrl}/${id}/publish`, {});
  }

  undoDelete(id: string): Observable<PageDto> {
    return this.http.post<PageDto>(`${this.apiUrl}/${id}/undo-delete`, {});
  }
}
