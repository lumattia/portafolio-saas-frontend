import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BackgroundImageTextSectionContent } from './background-image-text-section.model';
import { BaseSectionComponent } from '../base-section.component';

@Component({
  selector: 'app-background-image-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-image-text-section-render.component.html',
  styleUrls: ['./background-image-text-section-render.component.scss'],
})
export class BackgroundImageTextSectionRenderComponent extends BaseSectionComponent<BackgroundImageTextSectionContent> {
  private readonly sanitizer = inject(DomSanitizer);

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs?.text || '');
  }

  get backgroundStyle(): { [key: string]: string } {
    if (this.section().media) {
      return {
        'background-image': `url(${this.section().media!.url})`,
        'background-size': 'cover',
        'background-position': 'center',
        'background-repeat': 'no-repeat',
      };
    }
    return {};
  }
}
