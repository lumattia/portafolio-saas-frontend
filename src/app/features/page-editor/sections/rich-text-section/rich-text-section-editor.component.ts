import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { createDefaultRichTextSectionContent, RichTextSectionContent } from './rich-text-section.model';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-rich-text-section-editor',
  standalone: true,
  imports: [CommonModule, RichTextInputComponent],
  templateUrl: './rich-text-section-editor.component.html',
  styleUrls: ['./rich-text-section-editor.component.scss'],
})
export class RichTextSectionEditorComponent {
  section = input.required<SectionDto>();
  get content(): RichTextSectionContent {
    return createDefaultRichTextSectionContent(this.section().contentJson);
  }
  onContentChange(value: string | null): void {
    const section = this.section();
    if (!section) return;
    const updatedContent = { 
      inputs: { text: value ?? '' },
      styles: section.contentJson.styles || {}
    };
    section.contentJson = updatedContent;
  }
}
