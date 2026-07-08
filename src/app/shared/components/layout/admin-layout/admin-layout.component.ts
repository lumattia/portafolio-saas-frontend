import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { MenuService } from '../../../../core/services/menu.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { SiteService } from '../../../../core/services/site.service';
import { ThemeConfig } from '../../../../core/models/theme-config.model';
import { MenuRenderer, MenuType } from '../../../../core/models/menu.model';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { PageEditorComponent } from '../../../../features/page-editor/page-editor/page-editor.component';
import { ButtonComponent } from '../../button/button.component';
import { IconComponent } from '../../icon/icon.component';
import { SidebarMenuRendererComponent } from "../../../../features/admin/menus/sidebar-menu/sidebar-menu-renderer.component";
import { FooterMenuRendererComponent } from "../../../../features/admin/menus/footer-menu/footer-menu-renderer.component";
import { SidebarMenuEditorComponent } from '../../../../features/admin/menus/sidebar-menu/sidebar-menu-editor.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, CommonModule, ThemeToggleComponent, SidebarMenuEditorComponent, PageEditorComponent, ButtonComponent, IconComponent, SidebarMenuRendererComponent, FooterMenuRendererComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly router = inject(Router);
  readonly viewModeService = inject(ViewModeService);
  readonly menuService = inject(MenuService);
  readonly siteService = inject(SiteService);
  readonly MenuType = MenuType;
  
  readonly theme = signal<ThemeConfig | null>(null);
  readonly sidebarMenu = signal<MenuRenderer | null>(null);
  readonly footerMenu = signal<MenuRenderer | null>(null);
  readonly showSidenav = signal(false);
  readonly showUserMenu = signal(false);
  readonly isPublishing = signal(false);
  readonly publishMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  ngOnInit(): void {
    this.auth.getMe();
    this.loadTheme();
    this.loadSidebarMenu();
    this.loadFooterMenu();
  }

  private loadTheme(): void {
    this.themeService.getTheme().subscribe({
      next: (theme: ThemeConfig) => {
        this.theme.set(theme);
        this.applyTheme(theme);
      },
      error: (err: any) => {
        console.error('Failed to load theme', err);
      },
    });
  }

  private applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.light.primaryColor);
    root.style.setProperty('--secondary-color', theme.light.secondaryColor);
    root.style.setProperty('--background-color', theme.light.backgroundColor);
    root.style.setProperty('--surface-color', theme.light.surfaceColor);
    root.style.setProperty('--text-color', theme.light.textColor);
    root.style.setProperty('--text-secondary-color', theme.light.textSecondaryColor);
    root.style.setProperty('--font-family', theme.light.fontFamily);
    root.style.setProperty('--border-radius', theme.light.borderRadius);
  }

  private loadSidebarMenu(): void {
    this.menuService.getMenu(MenuType.Sidebar).subscribe({
      next: (menu: MenuRenderer | null) => {
        this.sidebarMenu.set(menu);
      },
      error: (err: any) => {
        console.error('Failed to load sidebar menu', err);
      }
    });
  }
private loadFooterMenu(): void {
    this.menuService.getMenu(MenuType.Footer).subscribe({
      next: (menu: MenuRenderer | null) => {
        this.footerMenu.set(menu);
      },
      error: (err: any) => {
        console.error('Failed to load footer menu', err);
      }
    });
  }
  toggleSidenav(): void {
    this.showSidenav.update(v => !v);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
    this.viewModeService.setViewMode('snapshot')
  }

  toggleViewMode(): void {
    if (this.auth.isAuthenticated()) {
      this.viewModeService.setViewMode(this.viewModeService.isAdminMode() ? 'snapshot' : 'admin');
    }
  }

  publishSite(): void {
    this.isPublishing.set(true);
    this.publishMessage.set(null);
    
    this.siteService.publish().subscribe({
      next: (result: boolean) => {
        this.isPublishing.set(false);
        if (result) {
          this.publishMessage.set({ type: 'success', text: 'Sitio publicado correctamente' });
          
          // Reload page after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.publishMessage.set({ type: 'error', text: 'Error al publicar el sitio' });
        }
      },
      error: (err: any) => {
        this.isPublishing.set(false);
        this.publishMessage.set({ type: 'error', text: 'Error al publicar el sitio' });
        console.error('Failed to publish site', err);
      }
    });
  }
}
