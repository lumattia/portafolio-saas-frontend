import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { ThemeConfig } from '../../../../core/models/theme-config.model';
import { PageEditorComponent } from '../../../../features/page-editor/page-editor/page-editor.component';
import { SidebarMenuRendererComponent } from "../../../../features/admin/menus/sidebar-menu/sidebar-menu-renderer.component";
import { FooterMenuRendererComponent } from "../../../../features/admin/menus/footer-menu/footer-menu-renderer.component";
import { PortfolioPageComponent } from "../../../../features/portfolio/pages/portfolio-page/portfolio-page.component";
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, PageEditorComponent, SidebarMenuRendererComponent, FooterMenuRendererComponent, PortfolioPageComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, CanDeactivateComponent {
  readonly auth = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly router = inject(Router);
  readonly viewModeService = inject(ViewModeService);

  @ViewChild(PageEditorComponent) pageEditorComponent!: PageEditorComponent;

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
    root.style.setProperty('--primary', theme.light.primaryColor);
    root.style.setProperty('--secondary', theme.light.secondaryColor);
    root.style.setProperty('--background-color', theme.light.backgroundColor);
    root.style.setProperty('--background-secondary', theme.light.surfaceColor);
    root.style.setProperty('--text-primary', theme.light.textColor);
    root.style.setProperty('--text-secondary-color', theme.light.textSecondaryColor);
    root.style.setProperty('--font-family', theme.light.fontFamily);
    root.style.setProperty('--border-radius', theme.light.borderRadius);
  }

  canDeactivate(): boolean {
    return this.viewModeService.isAdminMode() && this.pageEditorComponent.canDeactivate();
  }
}
