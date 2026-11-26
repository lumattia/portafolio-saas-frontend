export type UserRole = 'PlatformAdmin' | 'TenantOwner';

export interface User {
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  email: string;
  role: UserRole;
}
