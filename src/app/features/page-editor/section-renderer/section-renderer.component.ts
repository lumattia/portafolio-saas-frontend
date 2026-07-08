import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RENDER_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { SectionRenderer } from '../../../core/models/page.model';

@Component({
  selector: 'app-section-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-renderer.component.html',
  styleUrls: ['./section-renderer.component.scss'],
})
export class SectionRendererComponent {
  section = input.required<SectionRenderer>();
  isSelected = input.required<boolean>();
  select = output<string>();
  
  readonly componentMap = RENDER_COMPONENT_MAP;

  get componentSelector() {
    return this.section().componentSelector;
  }

  get isDeleted() {
    return this.section().isDeleted;
  }
}
