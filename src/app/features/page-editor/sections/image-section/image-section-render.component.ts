import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDefaultImageSectionContent, ImageSectionContent } from './image-section.model';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-image-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-section-render.component.html',
  styleUrls: ['./image-section-render.component.scss'],
})
export class ImageSectionRenderComponent {
  section = input.required<SectionDto>();
 
  get content(): ImageSectionContent {
    return createDefaultImageSectionContent(this.section()!.contentJson);
  }
}
