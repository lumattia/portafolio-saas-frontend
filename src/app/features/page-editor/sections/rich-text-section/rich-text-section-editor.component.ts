import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEditorService } from '../../../../core/services/page-editor.service';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { createDefaultRichTextSectionContent, RichTextSectionContent } from './rich-text-section.model';

@Component({
  selector: 'app-rich-text-section-editor',
  standalone: true,
  imports: [CommonModule, RichTextInputComponent],
  templateUrl: './rich-text-section-editor.component.html',
  styleUrls: ['./rich-text-section-editor.component.scss'],
})
export class RichTextSectionEditorComponent {
  private readonly pageEditorService = inject(PageEditorService);
  readonly selectedSection = this.pageEditorService.selectedSection;
  get content(): RichTextSectionContent {
    return createDefaultRichTextSectionContent(this.selectedSection()!.contentJson);
  }
  onContentChange(value: string | null): void {
    const section = this.selectedSection();
    if (!section) return;
    const updatedContent = { 
      inputs: { text: value ?? '' },
      styles: section.contentJson.styles || {}
    };
    this.pageEditorService.updateSectionContent(updatedContent);
  }
}
