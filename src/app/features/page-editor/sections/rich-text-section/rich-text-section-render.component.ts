import { Component, input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { createDefaultRichTextSectionContent, RichTextSectionContent } from './rich-text-section.model';
import { SectionDto } from '../../../../core/models/section.model';

@Component({
  selector: 'app-rich-text-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rich-text-section-render.component.html',
  styleUrls: ['./rich-text-section-render.component.scss'],
})
export class RichTextSectionRenderComponent {
  section = input.required<SectionDto>();
  private readonly sanitizer = inject(DomSanitizer);
  
  get content(): RichTextSectionContent {
    return createDefaultRichTextSectionContent(this.section()!.contentJson);
  }

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content.inputs?.text || '');
  }
}
