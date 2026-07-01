import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { createDefaultImageTextSectionContent, ImageTextSectionContent } from './image-text-section.model';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-image-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-text-section-render.component.html',
  styleUrls: ['./image-text-section-render.component.scss'],
})
export class ImageTextSectionRenderComponent {
  section = input.required<SectionDto>();
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
