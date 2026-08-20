import { Component, input, inject, signal, AfterViewInit, ElementRef, NgZone, HostListener, effect, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { HeaderMenuRendererComponent } from '../../../../features/admin/menus/header-menu/header-menu-renderer.component';
import { IconComponent } from '../../icon/icon.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { SiteService } from '../../../../core/services/site.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, HeaderMenuRendererComponent, IconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  readonly auth = inject(AuthService);
  readonly viewModeService = inject(ViewModeService);
  readonly siteService = inject(SiteService);
  readonly router = inject(Router);
  readonly elementRef = inject(ElementRef);
  readonly ngZone = inject(NgZone);
  readonly injector = inject(Injector);

  readonly onSidenavClick = input<(() => void) | null>(null);
  readonly showToolbar = signal(true);
  readonly isPublishing = signal(false);
  readonly showUserDropdown = signal(false);
  readonly isToolbarClosing = signal(false);
  readonly toolbarLeft = signal<number>(0);
  readonly toolbarTop = signal<number>(0);

  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialLeft = 0;
  private initialTop = 0;
  private animationFrameId: number | null = null;
  private dragListenersAttached = false;

  ngOnInit(){
    this.loadToolbarState();

    // Reconfigurar drag listeners cuando el toolbar se muestra/oculta
    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.showToolbar() && this.auth.isAuthenticated()) {
          setTimeout(() => this.setupDrag(), 0);
        } else {
          this.cleanupDrag();
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.setInitialToolbarPosition();
  }

  private setInitialToolbarPosition(): void {
    const storedLeft = localStorage.getItem('toolbarLeft');
    const storedTop = localStorage.getItem('toolbarTop');

    if (storedLeft && storedTop) {
      this.toolbarLeft.set(parseInt(storedLeft, 10));
      this.toolbarTop.set(parseInt(storedTop, 10));
    } else {
      // Posición inicial por defecto
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      this.toolbarLeft.set(windowWidth / 2 - 150);
      this.toolbarTop.set(windowHeight - 80);
    }
  }

  private loadToolbarState(): void {
    const stored = localStorage.getItem('toolbarVisible');
    if (stored !== null) {
      this.showToolbar.set(stored === 'true');
    }
  }

  private saveToolbarState(): void {
    localStorage.setItem('toolbarVisible', this.showToolbar().toString());
    localStorage.setItem('toolbarLeft', this.toolbarLeft().toString());
    localStorage.setItem('toolbarTop', this.toolbarTop().toString());
  }

  private setupDrag(): void {
    const toolbar = this.elementRef.nativeElement.querySelector('.draggable-toolbar');
    if (!toolbar || this.dragListenersAttached) return;

    this.ngZone.runOutsideAngular(() => {
      toolbar.addEventListener('mousedown', this.onMouseDown.bind(this));
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    });
    this.dragListenersAttached = true;
  }

  private cleanupDrag(): void {
    if (!this.dragListenersAttached) return;

    const toolbar = this.elementRef.nativeElement.querySelector('.draggable-toolbar');
    if (toolbar) {
      toolbar.removeEventListener('mousedown', this.onMouseDown.bind(this));
    }
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.dragListenersAttached = false;
  }

  private onMouseDown(event: MouseEvent): void {
    // Don't start drag if clicking on a button
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.initialLeft = this.toolbarLeft();
    this.initialTop = this.toolbarTop();
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;

      this.ngZone.run(() => {
        this.toolbarLeft.set(this.initialLeft + dx);
        this.toolbarTop.set(this.initialTop + dy);
      });
    });
  }

  private onMouseUp(): void {
    this.isDragging = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.saveToolbarState();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const userCardContainer = this.elementRef.nativeElement.querySelector('.user-card-container');
    if (userCardContainer && !userCardContainer.contains(event.target as Node)) {
      this.showUserDropdown.set(false);
    }
  }

  closeToolbar(): void {
    this.showToolbar.set(false);
    this.saveToolbarState();
  }

  openToolbar(): void {
    this.showToolbar.set(true);
    this.saveToolbarState();
  }

  closeToolbarWithAnimation(): void {
    this.isToolbarClosing.set(true);
    setTimeout(() => {
      this.closeToolbar();
      this.isToolbarClosing.set(false);
    }, 300);
  }

  publishSite(): void {
    this.isPublishing.set(true);
    this.siteService.publish().subscribe({
      next: (result: boolean) => {
        this.isPublishing.set(false);
        if (result) {
          window.location.reload();
        }
      },
      error: () => {
        this.isPublishing.set(false);
      }
    });
  }

  setViewMode(mode: 'admin' | 'preview' | 'snapshot'): void {
    if (this.auth.isAuthenticated()) {
      this.viewModeService.setViewMode(mode);
    }
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
