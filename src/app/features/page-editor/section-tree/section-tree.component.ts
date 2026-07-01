import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionDto } from '../../../core/models/section.model';

@Component({
  selector: 'app-section-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-tree.component.html',
  styleUrls: ['./section-tree.component.scss'],
})
export class SectionTreeComponent {
  sections = input.required<SectionDto[]>();
  selectedSection = input<SectionDto | null>(null);
  selectSection = output<SectionDto>();

  expandedSections = input<Set<string>>(new Set<string>());

  toggleExpand(sectionId: string): void {
    const currentExpanded = this.expandedSections();
    const newExpanded = new Set(currentExpanded);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    // Emit the expanded state change (would need to add output for this)
  }

  isExpanded(sectionId: string): boolean {
    return this.expandedSections().has(sectionId);
  }

  hasSubSections(section: SectionDto): boolean {
    return section.subSections && section.subSections.length > 0;
  }

  getSectionDisplayName(section: SectionDto): string {
    // This would ideally come from the template name
    return `Section ${section.id.substring(0, 8)}`;
  }
}
