import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Media } from '../models/media.model';
import { PagedList, PagedParameters } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getMedia(searchTerm?: string, mediaType?: string, parameters?: PagedParameters): Observable<PagedList<Media>> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (mediaType) params = params.set('mediaType', mediaType);
    if (parameters) {
      params = params.set('pageIndex', parameters.pageIndex.toString());
      params = params.set('pageSize', parameters.pageSize.toString());
      if (parameters.sortBy)  params = params.set('sortBy', parameters.sortBy);
      if (parameters.isDescending) params.set('isDescending', parameters.isDescending.toString());
    }

    return this.http.get<PagedList<Media>>(`${environment.apiUrl}/admin/media`, { params });
  }

  createMedia(file: File): Observable<Media> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Media>(`${environment.apiUrl}/admin/media`, formData);
  }

  updateMedia(id: string, file: File): Observable<Media> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<Media>(`${environment.apiUrl}/admin/media/${id}`, formData);
  }

  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/media/${id}`);
  }
}
