import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';
import { PageWrapperComponent } from './features/page-wrapper/page-wrapper.component';
import { LoginPageComponent } from './features/admin/pages/login-page/login-page.component';
import { RegisterTenantPageComponent } from './features/admin/pages/register-tenant-page/register-tenant-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: PageWrapperComponent },
      { path: 'login', component: LoginPageComponent },
      { path: 'register-tenant', component: RegisterTenantPageComponent, canActivate: [adminGuard] },
      { path: '**', component: PageWrapperComponent },
    ],
  },
];
