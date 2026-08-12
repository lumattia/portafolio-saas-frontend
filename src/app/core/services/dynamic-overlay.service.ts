import { Injectable, ComponentRef, ApplicationRef, EnvironmentInjector, createComponent, Type, TemplateRef, EmbeddedViewRef } from '@angular/core';

export interface OverlayRef<T> {
  componentInstance: any;
  result: Promise<any>;
  close: (result?: any) => void;
  dismiss: (reason?: any) => void;
}

interface InternalOverlayRef<T> extends OverlayRef<T> {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

@Injectable()
export abstract class DynamicOverlayService<TOptions> {
  protected container: HTMLElement | null = null;
  private activeOverlays: Map<ComponentRef<any> | EmbeddedViewRef<any>, OverlayRef<any>> = new Map();

  constructor(
    protected appRef: ApplicationRef,
    protected injector: EnvironmentInjector,
    private containerId: string
  ) {  }

  protected abstract configureContainerStyles(container: HTMLElement, options?: TOptions): void;

  private ensureContainer(options?: TOptions): HTMLElement {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      this.configureContainerStyles(this.container, options);
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  open<T>(content: Type<T> | TemplateRef<any>, options?: TOptions): OverlayRef<T> {
    const container = this.ensureContainer(options);

    let element: HTMLElement;
    let instance: any;
    let viewRef: ComponentRef<T> | EmbeddedViewRef<any>;

    if (content instanceof TemplateRef) {
      // Handle TemplateRef
      const embeddedViewRef = content.createEmbeddedView({});
      viewRef = embeddedViewRef;
      this.appRef.attachView(embeddedViewRef);
      element = embeddedViewRef.rootNodes[0] as HTMLElement;
      instance = {};
    } else {
      // Handle Component Type
      const componentRef = createComponent(content, {
        environmentInjector: this.injector
      });
      viewRef = componentRef;
      element = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
      this.appRef.attachView(componentRef.hostView);
      instance = componentRef.instance as any;
    }

    container!.appendChild(element);

    // Create a proxy to intercept property assignments and call setInput for inputs
    const proxy = new Proxy(instance, {
      set(target, prop, value) {
        // Only try setInput for components, not templates
        if (viewRef instanceof ComponentRef) {
          try {
            (viewRef as ComponentRef<T>).setInput(prop as string, value);
            return true;
          } catch {
            target[prop] = value;
            return true;
          }
        }
        target[prop] = value;
        return true;
      },
      get(target, prop) {
        return target[prop];
      }
    });

    if (container) {
      container.style.pointerEvents = 'auto';
    }

    let resolveFn: (value: any) => void;
    let rejectFn: (reason: any) => void;

    const resultPromise = new Promise<any>((resolve) => {
      resolveFn = resolve;
    });

    instance.close = (result?: any) => {
      const ref = this.activeOverlays.get(viewRef) as InternalOverlayRef<T>;
      if (ref) ref.close(result);
    };

    instance.dismiss = (reason?: any) => {
      const ref = this.activeOverlays.get(viewRef) as InternalOverlayRef<T>;
      if (ref) ref.dismiss(reason);
    };

    const overlayRef: InternalOverlayRef<T> = {
      componentInstance: proxy,
      result: resultPromise,
      resolve: resolveFn!,
      reject: rejectFn!,
      close: (result?: any) => this.closeOverlay(viewRef, { confirmed: true, data: result }),
      dismiss: (reason?: any) => this.closeOverlay(viewRef, { confirmed: false, reason })
    };

    this.activeOverlays.set(viewRef, overlayRef);
    return overlayRef;
  }

  private closeOverlay<T>(viewRef: ComponentRef<T> | EmbeddedViewRef<any>, output: any): void {
    const ref = this.activeOverlays.get(viewRef) as InternalOverlayRef<T>;
    if (ref) {
      ref.resolve(output);
      this.destroyOverlay(viewRef);
    }

    if (this.activeOverlays.size === 0 && this.container) {
      this.container.style.pointerEvents = 'none';
    }
  }

  private destroyOverlay<T>(viewRef: ComponentRef<T> | EmbeddedViewRef<any>): void {
    if (viewRef instanceof ComponentRef) {
      this.appRef.detachView(viewRef.hostView);
    } else {
      this.appRef.detachView(viewRef);
    }

    let element: HTMLElement;
    if (viewRef instanceof ComponentRef) {
      element = (viewRef.hostView as any).rootNodes[0] as HTMLElement;
    } else {
      element = viewRef.rootNodes[0] as HTMLElement;
    }

    if (element && this.container) {
      if (this.container.contains(element)) {
        this.container.removeChild(element);
      }
    }

    if (viewRef instanceof ComponentRef) {
      viewRef.destroy();
    }
    this.activeOverlays.delete(viewRef);
    if (this.activeOverlays.size === 0 && this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }

  closeAll(): void {
    this.activeOverlays.forEach((ref) => ref.dismiss('close all'));
  }
}
