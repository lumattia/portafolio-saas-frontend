import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEditorService } from '../../../../core/services/page-editor.service';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { BackgroundImageTextSectionContent, createDefaultBackgroundImageTextContent } from './background-image-text-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';

@Component({
  selector: 'app-background-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent, RichTextInputComponent],
  templateUrl: './background-image-text-section-editor.component.html',
  styleUrls: ['./background-image-text-section-editor.component.scss'],
})
export class BackgroundImageTextSectionEditorComponent {
  private readonly pageEditorService = inject(PageEditorService);
  readonly selectedSection = this.pageEditorService.selectedSection;

  get content(): BackgroundImageTextSectionContent {
    return createDefaultBackgroundImageTextContent(this.selectedSection()!.contentJson);
  }

  onContentChange(key: string, value: any): void {
    const section = this.selectedSection();
    if (!section) return;
    const safeValue = (value === null || value === undefined) ? '' : value;
    const updatedContent = { 
      inputs: { ...section.contentJson.inputs, [key]: safeValue },
      styles: section.contentJson.styles || {}
    };
    this.pageEditorService.updateSectionContent(updatedContent);
  }
}
