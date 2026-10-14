import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Media } from '../models/media.model';
import { PagedList } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getMedia(searchTerm?: string, mediaType?: string, pageIndex: number = 1, pageSize: number = 20): Observable<PagedList<Media>> {
    let params: any = { pageIndex, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;
    if (mediaType) params.mediaType = mediaType;

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
