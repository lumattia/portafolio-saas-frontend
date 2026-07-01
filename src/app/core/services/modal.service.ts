import { Injectable, ApplicationRef, EnvironmentInjector } from '@angular/core';
import { DynamicOverlayService } from './dynamic-overlay.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService extends DynamicOverlayService {
  constructor(appRef: ApplicationRef, injector: EnvironmentInjector) {
    super(appRef, injector, 'modal-container');
  }

  protected override configureContainerStyles(container: HTMLElement): void {
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.zIndex = '9999';
    container.style.pointerEvents = 'none';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
  }
}