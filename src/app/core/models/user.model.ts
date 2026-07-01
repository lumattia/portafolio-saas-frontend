export type UserRole = 'PlatformAdmin' | 'TenantOwner';

export interface User {
  tenantId: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  tenantId: string;
  email: string;
  role: UserRole;
}
