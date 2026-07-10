import { Injectable, ComponentRef, ApplicationRef, EnvironmentInjector, createComponent, Type } from '@angular/core';

export interface OverlayConfig {
  [key: string]: any;
}

export interface OverlayRef<T> {
  componentInstance: T;
  result: Promise<any>;
  close: (result?: any) => void;
  dismiss: (reason?: any) => void;
}

interface InternalOverlayRef<T> extends OverlayRef<T> {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

@Injectable()
export abstract class DynamicOverlayService {
  protected container: HTMLElement | null = null;
  private activeOverlays: Map<ComponentRef<any>, OverlayRef<any>> = new Map();

  constructor(
    protected appRef: ApplicationRef, 
    protected injector: EnvironmentInjector,
    private containerId: string
  ) {  }

  protected abstract configureContainerStyles(container: HTMLElement): void;

  private ensureContainer(): HTMLElement {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      this.configureContainerStyles(this.container);
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  open<T>(componentType: Type<T>, config: OverlayConfig = {}): OverlayRef<T> {
    const container = this.ensureContainer();
    const componentRef = createComponent(componentType, {
      environmentInjector: this.injector
    });
    
    const element = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    container!.appendChild(element);
    this.appRef.attachView(componentRef.hostView);
    
    const instance = componentRef.instance as any;
  
    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        instance[key] = config[key];
      }
    }
    
    if (container) {
      container.style.pointerEvents = 'auto';
    }
    
    let resolveFn: (value: any) => void;
    let rejectFn: (reason: any) => void;
    
    const resultPromise = new Promise<any>((resolve) => {
      resolveFn = resolve;
    });
    
    instance.close = (result?: any) => {
      const ref = this.activeOverlays.get(componentRef) as InternalOverlayRef<T>;
      if (ref) ref.close(result);
    };
    
    instance.dismiss = (reason?: any) => {
      const ref = this.activeOverlays.get(componentRef) as InternalOverlayRef<T>;
      if (ref) ref.dismiss(reason);
    };
    
    const overlayRef: InternalOverlayRef<T> = {
      componentInstance: instance,
      result: resultPromise,
      resolve: resolveFn!,
      reject: rejectFn!,
      close: (result?: any) => this.closeOverlay(componentRef, { confirmed: true, data: result }),
      dismiss: (reason?: any) => this.closeOverlay(componentRef, { confirmed: false, reason })
    };
    
    this.activeOverlays.set(componentRef, overlayRef);
    return overlayRef;
  }

  private closeOverlay<T>(componentRef: ComponentRef<T>, output: any): void {
    const ref = this.activeOverlays.get(componentRef) as InternalOverlayRef<T>;
    if (ref) {
      ref.resolve(output);
      this.destroyOverlay(componentRef);
    }
    
    if (this.activeOverlays.size === 0 && this.container) {
      this.container.style.pointerEvents = 'none';
    }
  }

  private destroyOverlay<T>(componentRef: ComponentRef<T>): void {
    this.appRef.detachView(componentRef.hostView);
    
    const element = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    
    if (element && this.container) {
      if (this.container.contains(element)) {
        this.container.removeChild(element);
      }
    }

    componentRef.destroy();
    this.activeOverlays.delete(componentRef);
    if (this.activeOverlays.size === 0 && this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }

  closeAll(): void {
    this.activeOverlays.forEach((ref) => ref.dismiss('close all'));
  }
}