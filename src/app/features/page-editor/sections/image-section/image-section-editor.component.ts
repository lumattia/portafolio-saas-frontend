import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { DimensionInputComponent } from "../../../../shared/components/dimension-input/dimension-input.component";
import { BaseSectionEditorComponent } from '../base-section-editor.component';
import { ImageSectionContent } from './image-section.model';

@Component({
  selector: 'app-image-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent, ButtonComponent, DimensionInputComponent],
  templateUrl: './image-section-editor.component.html',
  styleUrls: ['./image-section-editor.component.scss'],
})
export class ImageSectionEditorComponent  extends BaseSectionEditorComponent<ImageSectionContent>{
}
