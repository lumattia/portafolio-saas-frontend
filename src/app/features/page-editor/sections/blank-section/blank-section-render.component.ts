import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseSectionRendererComponent } from '../base-section-renderer.component';
import { DEFAULT_BLANK_SECTION_CONTENT, BlankSectionContent } from './blank-section.model';
import { ViewModeService } from '../../../../core/services/view-mode.service';

@Component({
  selector: 'app-blank-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blank-section-render.component.html',
  styleUrls: ['./blank-section-render.component.scss'],
})
export class BlankSectionRenderComponent extends BaseSectionRendererComponent<BlankSectionContent>{
  private viewModeService = inject(ViewModeService);
  override readonly defaultContent = DEFAULT_BLANK_SECTION_CONTENT;

  get isEditMode(): boolean {
    return this.viewModeService.isAdminMode();
  }
}
