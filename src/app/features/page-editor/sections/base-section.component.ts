import { Directive, input } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';

export interface BaseSectionContent {
  inputs: any;
  styles: any;
}

@Directive()
export abstract class BaseSectionComponent<T extends BaseSectionContent = BaseSectionContent> {
  section = input.required<SectionRenderer>();

  get imageUrl(){
    const req = this.section().imageUrl;
    if (req != null) return req;

    const file = this.section().file;
    if (file?.url) return file.url;
    return undefined;
  };
}
