import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDefaultImageSectionContent, ImageSectionContent } from './image-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { BaseSectionEditorComponent } from '../base-section-editor.component';

@Component({
  selector: 'app-image-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent],
  templateUrl: './image-section-editor.component.html',
  styleUrls: ['./image-section-editor.component.scss'],
})
export class ImageSectionEditorComponent  extends BaseSectionEditorComponent{
  get content(): ImageSectionContent {
    return createDefaultImageSectionContent(this.section()!.contentJson);
  }
}
