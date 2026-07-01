import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { createDefaultImageTextSectionContent, ImageTextSectionContent } from './image-text-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageInputComponent, RichTextInputComponent],
  templateUrl: './image-text-section-editor.component.html',
  styleUrls: ['./image-text-section-editor.component.scss'],
})
export class ImageTextSectionEditorComponent {
  section = input.required<SectionDto>();
  readonly showStylePanel = signal(false);
  
  get content(): ImageTextSectionContent {
      return createDefaultImageTextSectionContent(this.section()!.contentJson);
  }
  
  toggleStylePanel(): void {
    this.showStylePanel.update(v => !v);
  }

onContentChange(key: string, value: any, type: 'inputs' | 'styles' = 'inputs'): void {
  const safeValue = (value === null || value === undefined) ? '' : value;
  const currentInputs = this.section()!.contentJson.inputs || {};
  const currentStyles = this.section()!.contentJson.styles || {};
  const updatedContent = {
    inputs: type === 'inputs' ? { ...currentInputs, [key]: safeValue } : currentInputs,
    styles: type === 'styles' ? { ...currentStyles, [key]: safeValue } : currentStyles
  };

  this.section().contentJson = updatedContent;
}
}