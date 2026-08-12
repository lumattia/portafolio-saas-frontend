import { Injectable, ApplicationRef, EnvironmentInjector } from '@angular/core';
import { DynamicOverlayService } from './dynamic-overlay.service';

export interface SidenavOptions {
  disableBackdropClick?: boolean;
  position?: 'left' | 'right';
}

@Injectable({
  providedIn: 'root'
})
export class SidenavService extends DynamicOverlayService<SidenavOptions> {
  constructor(appRef: ApplicationRef, injector: EnvironmentInjector) {
    super(appRef, injector, 'sidenav-container');
  }

  protected override configureContainerStyles(container: HTMLElement, options?: SidenavOptions): void {
    const position = options?.position || 'right';

    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.bottom = '0';
    container.style.width = '100vw';
    container.style.zIndex = '9998';
    container.style.pointerEvents = 'none';
    container.style.display = 'flex';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    if (position === 'left') {
      container.style.left = '0';
      container.style.justifyContent = 'flex-start';
    } else {
      container.style.right = '0';
      container.style.justifyContent = 'flex-end';
    }

    // Add click handler to close on backdrop click
    if (!options?.disableBackdropClick) {
      container.addEventListener('click', (event: Event) => {
        if (event.target === container) {
          this.closeAll();
        }
      });
    }
  }
}
