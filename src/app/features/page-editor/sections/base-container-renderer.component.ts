import { Directive } from '@angular/core';
import { BaseSectionComponent } from './base-section.component';
import { RENDER_COMPONENT_MAP } from '../../../core/constants/component-maps';

@Directive()
export abstract class BaseContainerRendererComponent extends BaseSectionComponent {
  get subSections() {
    return this.section().subSections || [];
  }
  readonly componentMap = RENDER_COMPONENT_MAP;
}