import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DEFAULT_IMAGE_SECTION_CONTENT, ImageSectionContent } from './image-section.model';
import { BaseSectionRendererComponent } from '../base-section-renderer.component';

@Component({
  selector: 'app-image-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-section-render.component.html',
  styleUrls: ['./image-section-render.component.scss'],
})
export class ImageSectionRenderComponent extends BaseSectionRendererComponent<ImageSectionContent> {
  override readonly defaultContent = DEFAULT_IMAGE_SECTION_CONTENT;
}
