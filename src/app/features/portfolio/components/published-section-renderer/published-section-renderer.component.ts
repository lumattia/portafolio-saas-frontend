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

  get sectionDto(): SectionDto {
    return this.convertToSectionDto(this.section());
  }

  private convertToSectionDto(publishedSection: PublishedSnapshotSectionDto): SectionDto {
    return {
      id: crypto.randomUUID(),
      sectionTemplateId: '',
      componentSelector: publishedSection.componentSelector,
      contentJson: publishedSection.contentJson,
      order: publishedSection.order,
      isEnabled: true,
      isDeleted: false,
      isPublished: true,
      subSections: publishedSection.subSections.map(ps => this.convertToSectionDto(ps))
    };
  }
}
