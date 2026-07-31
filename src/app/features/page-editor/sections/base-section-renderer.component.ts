import { Directive, input } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';

@Directive()
export abstract class BaseSectionRendererComponent {
  section = input.required<SectionRenderer>();
  abstract get content(): any;
  get imageUrl(){
    const req = this.section().fileRequest;
    if (req?.base64 != null) return req.base64;

    const file = this.section().file;
    if (file?.url) return file.url;
    return undefined;
  };
}
