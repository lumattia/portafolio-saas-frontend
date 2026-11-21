import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList, PagedParameters } from '../models/common.models';
import { Tenant, TenantFilters } from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/tenants`;

  getTenants(parameters?: PagedParameters, filters?: TenantFilters): Observable<PagedList<Tenant>> {
    let params = parameters?.toHttpParams() ?? new HttpParams();
    if (filters?.domain) params = params.set('domain', filters.domain);
    return this.http.get<PagedList<Tenant>>(`${this.apiUrl}/table`, { params });
  }

  createTenant(email: string, password: string, configuredDomain: string): Observable<Tenant> {
    return this.http.post<Tenant>(this.apiUrl, { email, password, configuredDomain });
  }
}
