import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT, BackgroundImageTextSectionContent } from './background-image-text-section.model';
import { BaseSectionRendererComponent } from '../base-section-renderer.component';

@Component({
  selector: 'app-background-image-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-image-text-section-render.component.html',
  styleUrls: ['./background-image-text-section-render.component.scss'],
})
export class BackgroundImageTextSectionRenderComponent extends BaseSectionRendererComponent<BackgroundImageTextSectionContent> {
  private readonly sanitizer = inject(DomSanitizer);
  override readonly defaultContent = DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT;

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs?.text || '');
  }

  get backgroundStyle(): { [key: string]: string } {
    if (this.imageUrl) {
      return {
        'background-image': `url(${this.imageUrl})`,
        'background-size': 'cover',
        'background-position': 'center',
        'background-repeat': 'no-repeat',
      };
    }
    return {};
  }
}
