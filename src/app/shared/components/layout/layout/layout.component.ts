import { ViewMode } from './../../../../core/services/view-mode.service';
import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { PageEditorComponent } from '../../../../features/page-editor/page-editor/page-editor.component';
import { SidebarMenuRendererComponent } from "../../../../features/admin/menus/sidebar-menu/sidebar-menu-renderer.component";
import { FooterMenuRendererComponent } from "../../../../features/admin/menus/footer-menu/footer-menu-renderer.component";
import { PortfolioPageComponent } from "../../../../features/portfolio/pages/portfolio-page/portfolio-page.component";
import { SnapshotPageComponent } from "../../../../features/portfolio/pages/snapshot-page/snapshot-page.component";
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, PageEditorComponent, SidebarMenuRendererComponent, FooterMenuRendererComponent, PortfolioPageComponent, SnapshotPageComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, CanDeactivateComponent {
  readonly auth = inject(AuthService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly location = inject(Location);
  readonly viewModeService = inject(ViewModeService);

  @ViewChild(PageEditorComponent) pageEditorComponent!: PageEditorComponent;

  readonly isPublishing = signal(false);
  readonly showSidenav = signal(false);

  ngOnInit(): void {
    this.viewModeService.initViewMode();
    this.auth.getMe();
    this.route.url.subscribe(() => {
      this.checkSnapshotMode();
    });
  }

  private checkSnapshotMode(): void {
    const hash = window.location.hash.substring(1); // Remove the # symbol

    // If not authenticated, remove any hash parameters
    if (!this.auth.isAuthenticated() && hash) {
      window.location.hash = '';
      return;
    }

    // Check if URL has draft hash format: draft-{sectionId}
    if (hash && hash.startsWith('draft-')) {
      const sectionId = hash.replace('draft-', '');
      if (sectionId) {
        this.viewModeService.setViewMode('draft');
        return;
      }
    }

    // Check if URL has snapshot hash format: {versionId}-{snapshotId}
    if (hash && hash.includes('-') && !hash.startsWith('draft-')) {
      const [versionId, snapshotId] = hash.split('-');
      if (versionId && snapshotId) {
        this.viewModeService.setViewMode('published');
        return;
      }
    }
  }

  canDeactivate(): boolean {
    return this.viewModeService.isDraftMode() && this.pageEditorComponent.canDeactivate();
  }
}
