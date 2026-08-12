import { Directive, HostListener, inject, ElementRef, Renderer2, effect } from '@angular/core';
import { BaseSectionComponent, BaseSectionContent } from './base-section.component';

@Directive()
export abstract class BaseSectionRendererComponent<T extends BaseSectionContent = BaseSectionContent> extends BaseSectionComponent<T> {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  get content(): T {
    return this.section().contentJson as T || this.defaultContent;
  }
  abstract readonly defaultContent: T;
  constructor() {
    super();
    effect(() => {
      this.initializeContent(this.defaultContent);
      this.updateParentFlexStyle();
    });
  }

  /**
   * Synchronizes content with defaults:
   * - Removes fields not in defaults
   * - Adds missing fields from defaults with default values
   */
  private syncContent(current: any, defaults: any): any {
    const result: any = {};

    // Only keep keys that exist in defaults
    for (const key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
          result[key] = this.syncContent(current[key] || {}, defaults[key]);
        } else {
          result[key] = current[key] !== undefined && current[key] !== null ? current[key] : defaults[key];
        }
      }
    }

    return result;
  }

  initializeContent(defaultContent: T): void {
    if (!this.section().contentJson || Object.keys(this.section().contentJson).length === 0) {
      this.section().contentJson = defaultContent;
    } else {
      this.section().contentJson = this.syncContent(this.section().contentJson, defaultContent);
    }
  }

  @HostListener('window:dimension-update', ['$event'])
  onDimensionUpdate(event: Event): void {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.sectionId === this.section().id) {
      this.updateParentFlexStyle();
    }
  }

  private updateParentFlexStyle(): void {
    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement && parentElement.classList.contains('renderer')) {
      const content = this.content;

      // Apply width if it exists
      if (content.styles.width) {
        const width = content.styles.width;
        if (width.unit === 'auto') {
          this.renderer.setStyle(parentElement, 'width', 'auto');
        } else {
          this.renderer.setStyle(parentElement, 'width', `${width.value}${width.unit}`);
        }
      }

      // Apply height if it exists
      if (content.styles.height) {
        const height = content.styles.height;
        if (height.unit === 'auto') {
          this.renderer.setStyle(parentElement, 'height', 'auto');
        } else {
          this.renderer.setStyle(parentElement, 'height', `${height.value}${height.unit}`);
        }
      }
    }
  }
}
