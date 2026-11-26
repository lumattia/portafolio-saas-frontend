import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseSectionComponent } from '../base-section.component';
import { BlankSectionContent } from './blank-section.model';
import { ViewModeService } from '../../../../core/services/view-mode.service';

@Component({
  selector: 'app-blank-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blank-section-render.component.html',
  styleUrls: ['./blank-section-render.component.scss'],
})
export class BlankSectionRenderComponent extends BaseSectionComponent<BlankSectionContent>{
  private viewModeService = inject(ViewModeService);

  get isEditMode(): boolean {
    return this.viewModeService.isDraftMode();
  }
}
