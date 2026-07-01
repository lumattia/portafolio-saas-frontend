import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { BackgroundImageTextSectionContent, createDefaultBackgroundImageTextContent } from './background-image-text-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-background-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent, RichTextInputComponent],
  templateUrl: './background-image-text-section-editor.component.html',
  styleUrls: ['./background-image-text-section-editor.component.scss'],
})
export class BackgroundImageTextSectionEditorComponent {
  section = input.required<SectionDto>();

  get content(): BackgroundImageTextSectionContent {
    return createDefaultBackgroundImageTextContent(this.section().contentJson);
  }

  onContentChange(key: string, value: any): void {
    const safeValue = (value === null || value === undefined) ? '' : value;
    const updatedContent = { 
      inputs: { ...this.section().contentJson.inputs, [key]: safeValue },
      styles: this.section().contentJson.styles || {}
    };
    this.section().contentJson = updatedContent;
  }
}
