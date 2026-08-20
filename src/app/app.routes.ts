import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginPageComponent } from './features/admin/pages/login-page/login-page.component';
import { RegisterTenantPageComponent } from './features/admin/pages/register-tenant-page/register-tenant-page.component';
import { LayoutComponent } from './shared/components/layout/layout/layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register-tenant', component: RegisterTenantPageComponent, canActivate: [adminGuard] },
  { path: '**', component: LayoutComponent },
];
