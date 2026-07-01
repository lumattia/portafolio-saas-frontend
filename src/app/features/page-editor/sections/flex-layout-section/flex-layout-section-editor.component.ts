import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createDefaultFlexLayoutSectionContent, FlexLayoutSectionContent } from './flex-layout-section.model';
import { SectionDto } from '../../../../core/models/section.model';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { TemplateSelectorComponent } from '../../template-selector/template-selector.component';

@Component({
  selector: 'app-flex-layout-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flex-layout-section-editor.component.html',
  styleUrls: ['./flex-layout-section-editor.component.scss'],
})
export class FlexLayoutSectionEditorComponent {
  section = input.required<SectionDto>();
  private readonly sidenavService = inject(SidenavService);

  get content(): FlexLayoutSectionContent {
    return createDefaultFlexLayoutSectionContent(this.section()!.contentJson);
  }

  get subSections(): SectionDto[] {
    return this.section().subSections || [];
  }

  onContentChange(key: string, value: any): void {
    const updatedContent = { 
      inputs: { ...this.content.inputs, [key]: value },
      styles: this.content.styles || {}
    };
    this.section().contentJson = updatedContent;
  }

  addSubSection(): void {
    var sidenavRef = this.sidenavService.open(TemplateSelectorComponent);
    sidenavRef.result.then((res) => {
      if (res.confirmed && res.data) this.section().subSections?.push(res.data as SectionDto);
    });
  }

  removeSubSection(subSection: SectionDto): void {
    if (subSection.isPublished) {
      subSection.isDeleted = true;
    }else{
      subSection.subSections = subSection.subSections.filter(s => s.id !== subSection.id);
    }
  }
}
