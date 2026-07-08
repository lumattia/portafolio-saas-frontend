import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RENDER_COMPONENT_MAP } from '../../../../core/constants/component-maps';
import { SectionRenderer } from '../../../../core/models/page.model';

@Component({
  selector: 'app-published-section-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './published-section-renderer.component.html',
  styleUrls: ['./published-section-renderer.component.scss'],
})
export class PublishedSectionRendererComponent {
  section = input.required<SectionRenderer>();
  readonly componentMap = RENDER_COMPONENT_MAP;
}
