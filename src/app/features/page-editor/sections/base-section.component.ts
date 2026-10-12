import { computed, Directive, model } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';

export interface BaseSectionContent {
  inputs: any;
  styles: any;
}

@Directive()
export abstract class BaseSectionComponent<T extends BaseSectionContent = BaseSectionContent> {

}
