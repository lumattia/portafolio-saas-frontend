import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { DimensionInputComponent } from "../../../../shared/components/dimension-input/dimension-input.component";
import { BaseSectionEditorComponent } from '../base-section-editor.component';
import { CollapsibleComponent } from '../../../../shared/components/collapsible/collapsible.component';
import { SelectInputComponent } from "../../../../shared/components/inputs/select-input/select-input.component";
import { ImageTextSectionContent } from './image-text-section.model';
import { IdName } from '../../../../core/models/common.models';

@Component({
  selector: 'app-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageInputComponent, RichTextInputComponent, ButtonComponent, CollapsibleComponent, SelectInputComponent, DimensionInputComponent],
  templateUrl: './image-text-section-editor.component.html',
  styleUrls: ['./image-text-section-editor.component.scss'],
})
export class ImageTextSectionEditorComponent extends BaseSectionEditorComponent<ImageTextSectionContent> {
}
