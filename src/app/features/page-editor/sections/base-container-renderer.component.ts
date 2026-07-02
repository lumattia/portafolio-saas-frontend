import { Directive } from '@angular/core';
import { BaseSectionRendererComponent } from './base-section-renderer.component';
import { RENDER_COMPONENT_MAP } from '../../../core/constants/component-maps';

@Directive()
export abstract class BaseContainerRendererComponent extends BaseSectionRendererComponent {
  get subSections() {
    return this.section().subSections || [];
  }
  readonly componentMap = RENDER_COMPONENT_MAP;
}