import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { createDefaultImageTextSectionContent, ImageTextSectionContent } from './image-text-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { BaseSectionEditorComponent } from '../base-section-editor.component';

@Component({
  selector: 'app-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageInputComponent, RichTextInputComponent, ButtonComponent],
  templateUrl: './image-text-section-editor.component.html',
  styleUrls: ['./image-text-section-editor.component.scss'],
})
export class ImageTextSectionEditorComponent extends BaseSectionEditorComponent {
  readonly showStylePanel = signal(false);
  
  get content(): ImageTextSectionContent {
      return createDefaultImageTextSectionContent(this.section()!.contentJson);
  }
  
  toggleStylePanel(): void {
    this.showStylePanel.update(v => !v);
  }
}