import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImageTextSectionContent } from './image-text-section.model';
import { BaseSectionComponent } from '../base-section.component';
import { FormatDimensionPipe } from '../../../../core/utils/format-dimension.pipe';

@Component({
  selector: 'app-image-text-section-render',
  standalone: true,
  imports: [CommonModule, FormatDimensionPipe],
  templateUrl: './image-text-section-render.component.html',
  styleUrls: ['./image-text-section-render.component.scss'],
})
export class ImageTextSectionRenderComponent extends BaseSectionComponent<ImageTextSectionContent>{
  private readonly sanitizer = inject(DomSanitizer);

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs.text || '');
  }

  get positionClass(): string {
    return `${this.content.styles.imagePosition || 'top-left'}`;
  }
}
