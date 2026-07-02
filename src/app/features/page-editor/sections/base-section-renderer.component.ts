import { Directive, input } from '@angular/core';
import { SectionDto } from '../../../core/models/section.model';

@Directive()
export abstract class BaseSectionRendererComponent {
  section = input.required<SectionDto>();
  abstract get content(): any;
}