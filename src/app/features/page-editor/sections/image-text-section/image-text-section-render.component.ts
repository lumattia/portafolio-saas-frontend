import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DEFAULT_IMAGE_TEXT_SECTION_CONTENT, ImageTextSectionContent } from './image-text-section.model';
import { BaseSectionRendererComponent } from '../base-section-renderer.component';

@Component({
  selector: 'app-image-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-text-section-render.component.html',
  styleUrls: ['./image-text-section-render.component.scss'],
})
export class ImageTextSectionRenderComponent extends BaseSectionRendererComponent<ImageTextSectionContent>{
  private readonly sanitizer = inject(DomSanitizer);
  override readonly defaultContent = DEFAULT_IMAGE_TEXT_SECTION_CONTENT;

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs?.text || '');
  }

  get positionClass(): string {
    return `${this.content.styles?.imagePosition || 'top-left'}`;
  }
}
