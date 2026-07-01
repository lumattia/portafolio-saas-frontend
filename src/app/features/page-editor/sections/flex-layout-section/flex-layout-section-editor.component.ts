import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEditorService } from '../../../../core/services/page-editor.service';
import { createDefaultFlexLayoutSectionContent, FlexLayoutSectionContent } from './flex-layout-section.model';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-flex-layout-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flex-layout-section-editor.component.html',
  styleUrls: ['./flex-layout-section-editor.component.scss'],
})
export class FlexLayoutSectionEditorComponent {
  readonly pageEditorService = inject(PageEditorService);
  readonly selectedSection = this.pageEditorService.selectedSection;

  get content(): FlexLayoutSectionContent {
    return createDefaultFlexLayoutSectionContent(this.selectedSection()!.contentJson);
  }

  get subSections(): SectionDto[] {
    const section = this.selectedSection();
    return section?.subSections || [];
  }

  onContentChange(key: string, value: any): void {
    const section = this.selectedSection();
    if (!section) return;
    const updatedContent = { 
      inputs: { ...this.content.inputs, [key]: value },
      styles: this.content.styles || {}
    };
    this.pageEditorService.updateSectionContent(updatedContent);
  }

  addSubSection(): void {
    const section = this.selectedSection();
    if (!section) return;
    this.pageEditorService.openTemplateSelector(section.id);
  }
}
