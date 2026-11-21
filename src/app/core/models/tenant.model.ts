export interface Tenant {
  id: string;
  configuredDomain: string;
}

export interface TenantFilters {
  domain?: string;
}
