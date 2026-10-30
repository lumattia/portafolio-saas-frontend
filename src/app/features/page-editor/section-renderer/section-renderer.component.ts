import { Component, input, model, ModelSignal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RENDER_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { SectionRenderer } from '../../../core/models/page.model';
import { FormatDimensionPipe } from '../../../core/utils/format-dimension.pipe';

@Component({
  selector: 'app-section-renderer',
  standalone: true,
  imports: [CommonModule, FormatDimensionPipe],
  templateUrl: './section-renderer.component.html',
  styleUrls: ['./section-renderer.component.scss'],
})
export class SectionRendererComponent {
  section = input.required<SectionRenderer>();
  isSelected = input<boolean>(false);
  select = output<void>();
  disableInteraction = input<boolean>(false);

  readonly componentMap = RENDER_COMPONENT_MAP;

  get componentSelector() {
    return this.section().componentSelector;
  }

  get isDeleted() {
    return this.section().isDeleted;
  }
}
