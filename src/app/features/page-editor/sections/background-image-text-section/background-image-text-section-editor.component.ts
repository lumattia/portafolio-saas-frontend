import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BackgroundImageTextSectionContent, createDefaultBackgroundImageTextContent } from './background-image-text-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { BaseSectionEditorComponent } from '../base-section-editor.component';

@Component({
  selector: 'app-background-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent, RichTextInputComponent, ButtonComponent],
  templateUrl: './background-image-text-section-editor.component.html',
  styleUrls: ['./background-image-text-section-editor.component.scss'],
})
export class BackgroundImageTextSectionEditorComponent extends BaseSectionEditorComponent {

  get content(): BackgroundImageTextSectionContent {
    return createDefaultBackgroundImageTextContent(this.section().contentJson);
  }
}
