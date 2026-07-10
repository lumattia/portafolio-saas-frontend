import { Injectable, ApplicationRef, EnvironmentInjector } from '@angular/core';
import { DynamicOverlayService } from './dynamic-overlay.service';

@Injectable({
  providedIn: 'root'
})
export class SidenavService extends DynamicOverlayService {
  constructor(appRef: ApplicationRef, injector: EnvironmentInjector) {
    super(appRef, injector, 'sidenav-container');
  }

  protected override configureContainerStyles(container: HTMLElement): void {
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.right = '0';
    container.style.bottom = '0';
    container.style.width = '100vw';
    container.style.zIndex = '9998';
    container.style.pointerEvents = 'none';
    container.style.display = 'flex';
    container.style.justifyContent = 'flex-end';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  }
}