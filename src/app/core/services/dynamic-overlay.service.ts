import { Injectable, ComponentRef, ApplicationRef, EnvironmentInjector, createComponent, Type, TemplateRef, EmbeddedViewRef } from '@angular/core';

export interface OverlayRef<T> {
  componentInstance: any;
  result: Promise<any>;
  close: (result?: any) => void;
  dismiss: (reason?: any) => void;
}

export interface BaseOverlayOptions {
  disableBackdropClick?: boolean;
}

// Global z-index counter shared across all overlay services
let globalNextZIndex = 1000;

@Injectable()
export abstract class DynamicOverlayService<TOptions extends BaseOverlayOptions> {
  constructor(
    protected appRef: ApplicationRef,
    protected injector: EnvironmentInjector,
    private containerId: string
  ) {}

  protected abstract configureContainerStyles(container: HTMLElement, options?: TOptions): void;

  private createContainer(options?: TOptions): HTMLElement {
    const container = document.createElement('div');
    container.id = `${this.containerId}-${globalNextZIndex}`;
    container.style.zIndex = `${globalNextZIndex++}`;
    this.configureContainerStyles(container, options);
    document.body.appendChild(container);
    return container;
  }

  open<T>(content: Type<T> | TemplateRef<any>, options?: TOptions): OverlayRef<T> {
    const container = this.createContainer(options);
    const { element, instance, viewRef } = this.createContent(content);

    container.appendChild(element);
    container.style.pointerEvents = 'auto';

    const proxy = this.createProxy(instance, viewRef);
    const overlayRef = this.createOverlayRef(container, viewRef, proxy, options);

    this.attachBackdropHandler(container, overlayRef.dismiss, options);
    instance.close = overlayRef.close;
    instance.dismiss = overlayRef.dismiss;
    return overlayRef;
  }

  private createContent<T>(content: Type<T> | TemplateRef<any>): { element: HTMLElement; instance: any; viewRef: ComponentRef<T> | EmbeddedViewRef<any> } {
    if (content instanceof TemplateRef) {
      const embeddedViewRef = content.createEmbeddedView({});
      this.appRef.attachView(embeddedViewRef);
      return {
        element: embeddedViewRef.rootNodes[0] as HTMLElement,
        instance: {},
        viewRef: embeddedViewRef
      };
    }

    const componentRef = createComponent(content, {
      environmentInjector: this.injector
    });
    this.appRef.attachView(componentRef.hostView);
    return {
      element: (componentRef.hostView as any).rootNodes[0] as HTMLElement,
      instance: componentRef.instance as any,
      viewRef: componentRef
    };
  }

  private createProxy<T>(instance: any, viewRef: ComponentRef<T> | EmbeddedViewRef<any>): any {
    return new Proxy(instance, {
      set(target, prop, value) {
        if (viewRef instanceof ComponentRef && typeof value !== 'function') {
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
  }

  private createOverlayRef<T>(
    container: HTMLElement,
    viewRef: ComponentRef<T> | EmbeddedViewRef<any>,
    proxy: any,
    options?: TOptions
  ): OverlayRef<T> {
    let resolveFn!: (value: any) => void;
    const resultPromise = new Promise<any>((resolve) => {
      resolveFn = resolve;
    });

    let isDestroyed = false;

    const destroy = () => {
      if (isDestroyed) return;
      isDestroyed = true;


      if (viewRef instanceof ComponentRef) {
        this.appRef.detachView(viewRef.hostView);
        viewRef.destroy();
      } else {
        this.appRef.detachView(viewRef);
      }

      if (container.parentElement) {
        document.body.removeChild(container);
      }
    };

    const close = (result?: any) => {
      if (isDestroyed) return;
      resolveFn({ confirmed: true, data: result });
      destroy();
    };

    const dismiss = (reason?: any) => {
      if (isDestroyed) return;
      resolveFn({ confirmed: false, reason });
      destroy();
    };

    return {
      componentInstance: proxy,
      result: resultPromise,
      close,
      dismiss
    };
  }

  private attachBackdropHandler(container: HTMLElement, dismiss: (reason?: any) => void, options?: TOptions): void {
    if (options?.disableBackdropClick) return;

    let startedInside = false;

    container.addEventListener('pointerdown', (event: PointerEvent) => {
      startedInside = event.target !== container;
    });

    container.addEventListener('pointerup', (event: PointerEvent) => {
      if (!startedInside && event.target === container) {
        dismiss('backdrop click');
      }
      startedInside = false;
    });
  }
}
