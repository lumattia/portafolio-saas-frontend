import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { MenuService } from '../../../../core/services/menu.service';
import { PublishedService } from '../../../../core/services/published.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { ThemeConfig } from '../../../../core/models/theme-config.model';
import { MenuDto, MenuType, MenuSnapshotDto } from '../../../../core/models/menu.model';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { PortfolioPageComponent } from '../../../../features/portfolio/pages/portfolio-page/portfolio-page.component';
import { ButtonComponent } from '../../button/button.component';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterLink, CommonModule, ThemeToggleComponent, PortfolioPageComponent, ButtonComponent, IconComponent],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly publishedService = inject(PublishedService);
  private readonly themeService = inject(ThemeService);
  readonly viewModeService = inject(ViewModeService);
  private readonly router = inject(Router);
  
  readonly theme = signal<ThemeConfig | null>(null);
  readonly sidebarMenu = signal<MenuSnapshotDto | null>(null);
  readonly footerMenu = signal<MenuSnapshotDto | null>(null);
  readonly showSidenav = signal(false);
  readonly showUserMenu = signal(false);

  ngOnInit(): void {
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
    this.publishedService.getMenu(MenuType.Sidebar).subscribe({
      next: (menu: MenuSnapshotDto) => {
        if (menu == null) {
          return;
        }
        this.sidebarMenu.set(menu);
        console.log(this.sidebarMenu())
      },
      error: (err: any) => {
        console.error('Failed to load sidebar menu', err);
      }
    });
  }

  private loadFooterMenu(): void {
    this.publishedService.getMenu(MenuType.Footer).subscribe({
      next: (menu: MenuSnapshotDto) => {
        if (menu == null) {
          return;
        }
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

  toggleViewMode(): void {
    if (this.viewModeService.isAdminMode()) {
      this.viewModeService.setViewMode('snapshot');
    } else {
      this.viewModeService.setViewMode('admin');
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  handleMenuLinkClick(event: MouseEvent, url: string | undefined): void {
    if (!url) return;
    
    // Si es Ctrl+click o scroll click (middle button), dejar que el navegador maneje la navegación
    if (event.ctrlKey || event.button === 1) {
      return;
    }
    
    // Si es un click normal, prevenir el comportamiento por defecto y navegar internamente
    event.preventDefault();
    
    // Si es una URL externa (empieza con http:// o https://), abrir en nueva pestaña
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Si es una URL interna, navegar con el router
      this.router.navigateByUrl(url);
    }
  }
}
