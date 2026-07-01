import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDefaultImageSectionContent, ImageSectionContent } from './image-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-image-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent],
  templateUrl: './image-section-editor.component.html',
  styleUrls: ['./image-section-editor.component.scss'],
})
export class ImageSectionEditorComponent {
  section = input.required<SectionDto>();

  get content(): ImageSectionContent {
    return createDefaultImageSectionContent(this.section()!.contentJson);
  }

  onContentChange(value: string | null): void {
    const updatedContent = { 
      inputs: { image: value ?? '' },
      styles: this.section()!.contentJson.styles || {}
    };
    this.section().contentJson = updatedContent;
  }
}
