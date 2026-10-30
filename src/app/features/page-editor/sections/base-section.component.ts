import { Directive, input } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';

export interface BaseSectionContent {
  inputs: any;
  styles: any;
}

@Directive()
export abstract class BaseSectionComponent<T extends BaseSectionContent = BaseSectionContent> {
  section = input.required<SectionRenderer>();
  get content(): T {
    return this.section().contentJson as T;
  }
}
