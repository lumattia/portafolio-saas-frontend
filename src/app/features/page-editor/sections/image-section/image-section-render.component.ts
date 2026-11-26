import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSectionContent } from './image-section.model';
import { BaseSectionComponent } from '../base-section.component';
import { FormatDimensionPipe } from '../../../../core/utils/format-dimension.pipe';

@Component({
  selector: 'app-image-section-render',
  standalone: true,
  imports: [CommonModule, FormatDimensionPipe],
  templateUrl: './image-section-render.component.html',
  styleUrls: ['./image-section-render.component.scss'],
})
export class ImageSectionRenderComponent extends BaseSectionComponent<ImageSectionContent> {
}
