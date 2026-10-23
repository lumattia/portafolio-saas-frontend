import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
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
  readonly router = inject(Router);
  readonly viewModeService = inject(ViewModeService);

  @ViewChild(PageEditorComponent) pageEditorComponent!: PageEditorComponent;

  readonly isPublishing = signal(false);
  readonly showSidenav = signal(false);

  ngOnInit(): void {
    this.viewModeService.initViewMode();
    this.auth.getMe();
  }

  canDeactivate(): boolean {
    return this.viewModeService.isAdminMode() && this.pageEditorComponent.canDeactivate();
  }
}
