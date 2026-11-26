import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RichTextSectionContent } from './rich-text-section.model';
import { BaseSectionComponent } from '../base-section.component';

@Component({
  selector: 'app-rich-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rich-text-section-render.component.html',
  styleUrls: ['./rich-text-section-render.component.scss'],
})
export class RichTextSectionRenderComponent extends BaseSectionComponent<RichTextSectionContent>{
  private readonly sanitizer = inject(DomSanitizer);

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs.text || '');
  }
}
