import { Directive } from '@angular/core';
import { BaseSectionComponent } from './base-section.component';

@Directive()
export abstract class BaseContainerRendererComponent extends BaseSectionComponent {
  get subSections() {
    return this.section().subSections || [];
  }
}