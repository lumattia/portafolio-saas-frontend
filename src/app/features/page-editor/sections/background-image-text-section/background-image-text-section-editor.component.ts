import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaInputComponent } from '../../../../shared/components/inputs/media-input/media-input.component';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { DimensionInputComponent } from "../../../../shared/components/dimension-input/dimension-input.component";
import { BaseSectionEditorComponent } from '../base-section-editor.component';
import { BackgroundImageTextSectionContent } from './background-image-text-section.model';

@Component({
  selector: 'app-background-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, MediaInputComponent, RichTextInputComponent, ButtonComponent, DimensionInputComponent],
  templateUrl: './background-image-text-section-editor.component.html',
  styleUrls: ['./background-image-text-section-editor.component.scss'],
})
export class BackgroundImageTextSectionEditorComponent extends BaseSectionEditorComponent<BackgroundImageTextSectionContent> {
}
