import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishedSnapshotSectionDto } from '../../../../core/models/published-snapshot.model';
import { SectionDto } from '../../../../core/models/section.model';
import { RENDER_COMPONENT_MAP } from '../../../../core/constants/component-maps';

@Component({
  selector: 'app-published-section-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './published-section-renderer.component.html',
  styleUrls: ['./published-section-renderer.component.scss'],
})
export class PublishedSectionRendererComponent {
  section = input.required<PublishedSnapshotSectionDto>();
  readonly componentMap = RENDER_COMPONENT_MAP;
}
