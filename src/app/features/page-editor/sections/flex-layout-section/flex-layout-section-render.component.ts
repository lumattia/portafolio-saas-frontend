import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDefaultFlexLayoutSectionContent, FlexLayoutSectionContent } from './flex-layout-section.model';
import { BaseContainerRendererComponent } from '../base-container-renderer.component';
import { SectionRendererComponent } from "../../section-renderer/section-renderer.component";

@Component({
  selector: 'app-flex-layout-section-render',
  standalone: true,
  imports: [CommonModule, forwardRef(() => SectionRendererComponent)],
  templateUrl: './flex-layout-section-render.component.html',
  styleUrls: ['./flex-layout-section-render.component.scss'],
})
export class FlexLayoutSectionRenderComponent  extends BaseContainerRendererComponent{
  get content(): FlexLayoutSectionContent {
    return createDefaultFlexLayoutSectionContent(this.section()!.contentJson);
  }

  get containerStyle(): { [key: string]: string } {
    return {
      display: 'flex',
      gap: `${this.content.styles.gap}px`,
      'justify-content': this.content.styles.justifyContent || 'flex-start',
      'align-items': this.content.styles.alignItems || 'flex-start',
    };
  }
}
