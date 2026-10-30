import { Directive, effect } from '@angular/core';
import { BaseSectionComponent, BaseSectionContent } from './base-section.component';

@Directive()
export abstract class BaseSectionRendererComponent<T extends BaseSectionContent = BaseSectionContent> extends BaseSectionComponent<T> {
  abstract readonly defaultContent: T;
  constructor() {
    super();

    effect(() => {
      this.initializeContent(this.defaultContent);
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
}
