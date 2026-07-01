import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDefaultFlexLayoutSectionContent, FlexLayoutSectionContent } from './flex-layout-section.model';
import { SectionDto } from '../../../../core/models/section.model';
import { RENDER_COMPONENT_MAP } from '../../../../core/constants/component-maps';

@Component({
  selector: 'app-flex-layout-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flex-layout-section-render.component.html',
  styleUrls: ['./flex-layout-section-render.component.scss'],
})
export class FlexLayoutSectionRenderComponent {
  section = input.required<SectionDto>();
  subSections = computed(() => this.section().subSections || []);

  readonly componentMap = RENDER_COMPONENT_MAP;
 
  get content(): FlexLayoutSectionContent {
    return createDefaultFlexLayoutSectionContent(this.section()!.contentJson);
  }

  get containerStyle(): { [key: string]: string } {
    return {
      display: 'flex',
      'flex-direction': this.content.styles.direction || 'row',
      gap: `${this.content.styles.gap || 16}px`,
      'justify-content': this.content.styles.justifyContent || 'flex-start',
      'align-items': this.content.styles.alignItems || 'flex-start',
      'flex-wrap': this.content.styles.wrap || 'nowrap',
    };
  }
}
