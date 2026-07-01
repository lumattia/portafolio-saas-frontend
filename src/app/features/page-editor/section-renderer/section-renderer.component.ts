import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionDto } from '../../../core/models/section.model';
import { RENDER_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { PageEditorService } from '../../../core/services/page-editor.service';

@Component({
  selector: 'app-section-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-renderer.component.html',
  styleUrls: ['./section-renderer.component.scss'],
})
export class SectionRendererComponent {
  private readonly pageEditorService = inject(PageEditorService);
  section = input.required<SectionDto>();
  isSelected = input(false);
  select = output<string>();
  
  readonly componentMap = RENDER_COMPONENT_MAP;

  get componentSelector() {
    return this.section().componentSelector;
  }

  get isDeleted() {
    return this.section().isDeleted;
  }
}
