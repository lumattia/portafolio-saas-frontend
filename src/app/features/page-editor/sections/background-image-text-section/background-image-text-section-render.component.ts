import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BackgroundImageTextSectionContent, createDefaultBackgroundImageTextContent } from './background-image-text-section.model';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-background-image-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-image-text-section-render.component.html',
  styleUrls: ['./background-image-text-section-render.component.scss'],
})
export class BackgroundImageTextSectionRenderComponent {
  section = input.required<SectionDto>();
  
  get content(): BackgroundImageTextSectionContent {
    return createDefaultBackgroundImageTextContent(this.section().contentJson);
  }
  private readonly sanitizer = inject(DomSanitizer);

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs?.text || '');
  }

  get backgroundStyle(): { [key: string]: string } {
    if (this.content.inputs?.backgroundImage) {
      return {
        'background-image': `url(${this.content.inputs.backgroundImage})`,
        'background-size': 'cover',
        'background-position': 'center',
        'background-repeat': 'no-repeat',
      };
    }
    return {};
  }
}
