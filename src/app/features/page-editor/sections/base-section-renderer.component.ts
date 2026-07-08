import { Directive, input } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';

@Directive()
export abstract class BaseSectionRendererComponent {
  section = input.required<SectionRenderer>();
  abstract get content(): any;
}