import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { createDefaultRichTextSectionContent, RichTextSectionContent } from './rich-text-section.model';
import { BaseSectionEditorComponent } from '../base-section-editor.component';

@Component({
  selector: 'app-rich-text-section-editor',
  standalone: true,
  imports: [CommonModule, RichTextInputComponent],
  templateUrl: './rich-text-section-editor.component.html',
  styleUrls: ['./rich-text-section-editor.component.scss'],
})
export class RichTextSectionEditorComponent extends BaseSectionEditorComponent{
  get content(): RichTextSectionContent {
    return createDefaultRichTextSectionContent(this.section().contentJson);
  }
}
