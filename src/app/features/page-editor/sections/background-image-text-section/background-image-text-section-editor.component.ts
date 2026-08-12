import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { DimensionInputComponent } from "../../../../shared/components/dimension-input/dimension-input.component";
import { BaseSectionEditorComponent } from '../base-section-editor.component';
import { BackgroundImageTextSectionContent } from './background-image-text-section.model';

@Component({
  selector: 'app-background-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent, RichTextInputComponent, ButtonComponent, DimensionInputComponent],
  templateUrl: './background-image-text-section-editor.component.html',
  styleUrls: ['./background-image-text-section-editor.component.scss'],
})
export class BackgroundImageTextSectionEditorComponent extends BaseSectionEditorComponent<BackgroundImageTextSectionContent> {
}
