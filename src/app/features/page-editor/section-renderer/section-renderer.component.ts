import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionRenderer } from '../../../core/models/page.model';
import { FormatDimensionPipe } from '../../../core/utils/format-dimension.pipe';
import { SectionComponentLoader } from '../../../core/services/section-component-loader.service';

@Component({
  selector: 'app-section-renderer',
  standalone: true,
  imports: [CommonModule, FormatDimensionPipe],
  templateUrl: './section-renderer.component.html',
  styleUrls: ['./section-renderer.component.scss'],
})
export class SectionRendererComponent {
  private readonly componentLoader = inject(SectionComponentLoader);
  section = input.required<SectionRenderer>();
  isSelected = input<boolean>(false);
  select = output<void>();
  disableInteraction = input<boolean>(false);

  get componentType() {
    return this.componentLoader.componentFor(this.componentSelector, 'render');
  }

  get componentSelector() {
    return this.section().componentSelector;
  }

  get isDeleted() {
    return this.section().isDeleted;
  }
}
