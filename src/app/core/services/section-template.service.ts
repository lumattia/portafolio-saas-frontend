import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SectionTemplateDto,
  SectionTemplateFilterRequest,
} from '../models/section-template.model';
import { IdName, PagedList, PagedParameters } from '../models/common.models';
import { MenuItem } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class SectionTemplateService {
  private readonly http = inject(HttpClient);
  private readonly sectionCategory = signal<IdName[]>([]);
  private readonly apiUrl = `${environment.apiUrl}/admin/sectiontemplates`;

  getAll(
    filter?: SectionTemplateFilterRequest,
    parameters?: PagedParameters
  ): Observable<PagedList<SectionTemplateDto>> {
    let params = new HttpParams();

    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.categoryTags !== undefined) {
      params = params.set('categoryTags', filter.categoryTags.toString());
    }

    if (parameters) {
      params = params.set('pageIndex', parameters.pageIndex.toString());
      params = params.set('pageSize', parameters.pageSize.toString());
      if (parameters.sortBy) {
        params = params.set('sortBy', parameters.sortBy);
      }
      params = params.set('isDescending', parameters.isDescending.toString());
    }

    return this.http.get<PagedList<SectionTemplateDto>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<SectionTemplateDto> {
    return this.http.get<SectionTemplateDto>(`${this.apiUrl}/${id}`);
  }

  getCategoryTags(): Observable<IdName[]> {
    if (this.sectionCategory.length>0) {
      return of(this.sectionCategory());
    }
    const observable = this.http.get<IdName[]>(`${environment.apiUrl}/enum/section-categories`);
    observable.subscribe({
      next: (tag) => this.sectionCategory.set(tag),
      error: (err) => console.error('Failed to load menu', err)
    });
    return observable;
  }
}
