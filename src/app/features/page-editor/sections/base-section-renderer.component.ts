import { Directive, inject, ElementRef, Renderer2, effect, computed, model } from '@angular/core';
import { BaseSectionComponent, BaseSectionContent } from './base-section.component';
import { SectionRenderer } from '../../../core/models/page.model';

@Directive()
export abstract class BaseSectionRendererComponent<T extends BaseSectionContent = BaseSectionContent> extends BaseSectionComponent<T> {
  section = model.required<SectionRenderer>();
  get content(): T {
    return this.section().contentJson as T;
  }
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  abstract readonly defaultContent: T;
  readonly widthDimension = computed(() => {
    const sec = this.section();
    return sec?.contentJson?.styles?.width;
  });

  readonly heightDimension = computed(() => {
    const sec = this.section();
    return sec?.contentJson?.styles?.height;
  });
  constructor() {
    super();

    effect(() => {
      this.initializeContent(this.defaultContent);
    });
    effect(() => {
      const width = this.widthDimension();
      const height = this.heightDimension();

      this.updateParentFlexStyle(width, height);
    });
  }

  private syncContent(current: any, defaults: any): any {
    const result: any = {};

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

  private updateParentFlexStyle(width?: any, height?: any): void {
    const parentElement = this.elementRef.nativeElement.parentElement;
    if (!parentElement || !parentElement.classList.contains('renderer')) {
      return;
    }

    if (width) {
      if (width.unit === 'auto') {
        this.renderer.setStyle(parentElement, 'width', 'auto');
      } else {
        this.renderer.setStyle(parentElement, 'width', `${width.value}${width.unit}`);
      }
    }

    if (height) {
      if (height.unit === 'auto') {
        this.renderer.setStyle(parentElement, 'height', 'auto');
      } else {
        this.renderer.setStyle(parentElement, 'height', `${height.value}${height.unit}`);
      }
    }
  }
}
