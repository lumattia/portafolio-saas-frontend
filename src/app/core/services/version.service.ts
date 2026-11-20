import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageFilters, PageTableItem } from '../models/page.model';
import { VersionList } from '../models/version.model';
import { PagedList, PagedParameters } from '../models/common.models';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/versions`;

  getVersions(): Observable<VersionList> {
    return this.http.get<VersionList>(this.apiUrl);
  }

  getPages(versionId: string | null, latest: boolean, parameters?: PagedParameters, filters?: PageFilters): Observable<PagedList<PageTableItem>> {
    let params = parameters?.toHttpParams() ?? new HttpParams();
    if (filters?.slug) params = params.set('slug', filters.slug);
    if (filters?.title) params = params.set('title', filters.title);
    if (filters?.isDeleted != null) params = params.set('isDeleted', filters.isDeleted.toString());
    if (filters?.disabled != null) params = params.set('disabled', filters.disabled.toString());
    if (latest) params = params.set('latest', 'true');
    const url = versionId ? `${this.apiUrl}/${versionId}/pages` : `${this.apiUrl}/pages`;
    return this.http.get<PagedList<PageTableItem>>(url, { params });
  }
}
