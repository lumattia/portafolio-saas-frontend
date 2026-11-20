import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { LoginPageComponent } from './features/admin/pages/login-page/login-page.component';
import { RegisterTenantPageComponent } from './features/admin/pages/register-tenant-page/register-tenant-page.component';
import { LayoutComponent } from './shared/components/layout/layout/layout.component';
import { UnsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { MediaGalleryComponent } from './features/admin/medias/media-gallery/media-gallery.component';
import { TablesLayoutComponent } from './features/admin/tables/tables-layout/tables-layout.component';
import { PagesTableComponent } from './features/admin/tables/pages-table/pages-table.component';
import { VersionsTableComponent } from './features/admin/tables/versions-table/versions-table.component';
import { HeaderComponent } from './shared/components/layout/header/header.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: 'register-tenant', component: RegisterTenantPageComponent, canActivate: [adminGuard] },
      { path: 'media-gallery', component: MediaGalleryComponent, canActivate: [adminGuard] },
      {
        path: 'tables',
        component: TablesLayoutComponent,
        canActivate: [adminGuard],
        children: [
          { path: 'pages', component: PagesTableComponent },
          { path: 'versions', component: VersionsTableComponent },
        ]
      },
      { path: '**', component: LayoutComponent, canDeactivate: [UnsavedChangesGuard] },
    ]
  },
];
