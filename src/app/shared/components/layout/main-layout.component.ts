import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { MenuService } from '../../../core/services/menu.service';
import { ViewModeService } from '../../../core/services/view-mode.service';
import { ThemeConfig } from '../../../core/models/theme-config.model';
import { MenuItem } from '../../../core/models/menu.model';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { MenuManagementComponent } from '../../../features/admin/menu-management/menu-management.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent, MenuManagementComponent, ButtonComponent, IconComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly menuService = inject(MenuService);
  readonly router = inject(Router);
  readonly viewModeService = inject(ViewModeService);
  readonly theme = signal<ThemeConfig | null>(null);
  readonly showSidenav = signal(false);
  readonly showUserMenu = signal(false);

  ngOnInit(): void {
    this.auth.getMe();
    this.loadTheme();
    this.loadMenu();
    this.viewModeService.initViewMode();
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
  private loadMenu(): void {
    this.menuService.getMenu().subscribe({
      next: (menus: MenuItem[]) => {
        // Menu is now managed by MenuService signal
      },
      error: (err: any) => {
        console.error('Failed to load menu', err);
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

  toggleSidenav(): void {
    this.showSidenav.update(v => !v);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }

  toggleViewMode(): void {
    if (this.auth.isAuthenticated()) {
      this.viewModeService.setViewMode(this.viewModeService.isAdminMode() ? 'snapshot' : 'admin');
      this.loadMenu();
    }
  }
}
