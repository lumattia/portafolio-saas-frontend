import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { createDefaultImageTextSectionContent, ImageTextSectionContent } from './image-text-section.model';
import { BaseSectionRendererComponent } from '../base-section-renderer.component';

@Component({
  selector: 'app-image-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-text-section-render.component.html',
  styleUrls: ['./image-text-section-render.component.scss'],
})
export class ImageTextSectionRenderComponent  extends BaseSectionRendererComponent{
  private readonly sanitizer = inject(DomSanitizer);
  
  get content(): ImageTextSectionContent {
    return createDefaultImageTextSectionContent(this.section()!.contentJson);
  }

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs?.text || '');
  }

  get positionClass(): string {
    return `${this.content.styles?.imagePosition || 'top-left'}`;
  }
}
