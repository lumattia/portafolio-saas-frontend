import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { MenuService } from '../../../../core/services/menu.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { ThemeConfig } from '../../../../core/models/theme-config.model';
import { MenuRenderer, MenuType } from '../../../../core/models/menu.model';
import { PageEditorComponent } from '../../../../features/page-editor/page-editor/page-editor.component';
import { ButtonComponent } from '../../button/button.component';
import { IconComponent } from '../../icon/icon.component';
import { SidebarMenuRendererComponent } from "../../../../features/admin/menus/sidebar-menu/sidebar-menu-renderer.component";
import { FooterMenuRendererComponent } from "../../../../features/admin/menus/footer-menu/footer-menu-renderer.component";
import { MenuEditorComponent } from '../../../../features/admin/menus/menu-editor/menu-editor.component';
import { HeaderComponent } from "../header/header.component";
import { PortfolioPageComponent } from "../../../../features/portfolio/pages/portfolio-page/portfolio-page.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, PageEditorComponent, SidebarMenuRendererComponent, FooterMenuRendererComponent, HeaderComponent, PortfolioPageComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly router = inject(Router);
  readonly viewModeService = inject(ViewModeService);

  readonly theme = signal<ThemeConfig | null>(null);
  readonly isPublishing = signal(false);
  readonly showSidenav = signal(false);

  ngOnInit(): void {
    this.viewModeService.initViewMode();
    this.auth.getMe();
    this.loadTheme();
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

  toggleSidenav(): void {
    this.showSidenav.update(v => !v);
  }
}
