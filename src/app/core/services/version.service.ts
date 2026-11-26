import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageFilters, PageTableItem } from '../models/page.model';
import { VersionList } from '../models/version.model';
import { IdName, PagedList, PagedParameters } from '../models/common.models';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/versions`;

  readonly versions = signal<IdName<number>[]>([]);
  readonly currentVersionNumber = signal<number | null>(null);

  getVersions(): Observable<VersionList> {
    return this.http.get<VersionList>(this.apiUrl);
  }

  loadVersions(): Observable<VersionList> {
    return this.getVersions().pipe(
      tap((result) => {
        this.versions.set(result.versions);
        this.currentVersionNumber.set(result.currentVersionNumber);
      })
    );
  }

  getPages(versionNumber: number | null, latest: boolean, parameters?: PagedParameters, filters?: PageFilters): Observable<PagedList<PageTableItem>> {
    let params = parameters?.toHttpParams() ?? new HttpParams();
    if (filters?.slug) params = params.set('slug', filters.slug);
    if (filters?.title) params = params.set('title', filters.title);
    if (filters?.isDeleted != null) params = params.set('isDeleted', filters.isDeleted.toString());
    if (filters?.disabled != null) params = params.set('disabled', filters.disabled.toString());
    if (latest) params = params.set('latest', 'true');
    const url = versionNumber != null ? `${this.apiUrl}/${versionNumber}/pages` : `${this.apiUrl}/pages`;
    return this.http.get<PagedList<PageTableItem>>(url, { params });
  }
}
