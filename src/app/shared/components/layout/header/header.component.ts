import { Component, input, inject, signal, AfterViewInit, ElementRef, NgZone, HostListener, effect, runInInjectionContext, Injector, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { HeaderMenuRendererComponent } from '../../../../features/admin/menus/header-menu/header-menu-renderer.component';
import { IconComponent } from '../../icon/icon.component';
import { ButtonComponent } from '../../button/button.component';
import { PopupComponent } from '../../popup/popup.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ViewMode, ViewModeService } from '../../../../core/services/view-mode.service';
import { SiteService } from '../../../../core/services/site.service';
import { ModalService } from '../../../../core/services/modal.service';
import { MessageModalComponent } from '../../modals/message-modal/message-modal.component';
import { DraggableToolbarComponent } from '../../draggable-toolbar/draggable-toolbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, HeaderMenuRendererComponent, IconComponent, ButtonComponent, PopupComponent, DraggableToolbarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly viewModeService = inject(ViewModeService);
  readonly modalService = inject(ModalService);
  readonly siteService = inject(SiteService);
  readonly router = inject(Router);
  readonly elementRef = inject(ElementRef);
  readonly ngZone = inject(NgZone);
  readonly injector = inject(Injector);

  @ViewChild(DraggableToolbarComponent) draggableToolbar!: DraggableToolbarComponent;

  readonly onSidenavClick = input<(() => void) | null>(null);
  readonly isPublishing = signal(false);
  readonly isUserCardHighlighting = signal(false);

  onToolbarClose(): void {
    this.draggableToolbar.closeToolbar();
    this.isUserCardHighlighting.set(true);
    setTimeout(() => {
      this.isUserCardHighlighting.set(false);
    }, 1000);
  }

  openToolbar(): void {
    if (this.draggableToolbar) {
      this.draggableToolbar.openToolbar();
    }
  }

  publishSite(): void {
    this.isPublishing.set(true);
    this.siteService.publish().subscribe({
      next: (result: boolean) => {
        this.isPublishing.set(false);
          if (result) {
          const modalRef = this.modalService.open(MessageModalComponent, {
            disableBackdropClick: false
          });
          modalRef.componentInstance.title = 'Publicación Exitosa';
          modalRef.componentInstance.message = 'El sitio se ha publicado correctamente.';
          modalRef.componentInstance.type = 'success';

          modalRef.result.then(() => {
            window.location.reload();
          });
        } else {
          const modalRef = this.modalService.open(MessageModalComponent, {
            disableBackdropClick: false
          });
          modalRef.componentInstance.title = 'Error en la Publicación';
          modalRef.componentInstance.message = 'Hubo un error al publicar el sitio.';
          modalRef.componentInstance.type = 'error';
        }
      },
      error: () => {
        this.isPublishing.set(false);
        const modalRef = this.modalService.open(MessageModalComponent, {
          disableBackdropClick: false
        });
        modalRef.componentInstance.title = 'Error en la Publicación';
        modalRef.componentInstance.message = 'Hubo un error al publicar el sitio.';
        modalRef.componentInstance.type = 'error';
      }
    });
  }

  setViewMode(mode: ViewMode): void {
    if (this.auth.isAuthenticated()) {
      this.viewModeService.setViewMode(mode);
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
