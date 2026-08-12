import { BaseSectionContent } from '../base-section.component';
import { DimensionValue, HeightUnit, WidthUnit } from '../dimension.model';

export interface BlankSectionContent extends BaseSectionContent {
  inputs: {};
  styles: {
    height: DimensionValue<HeightUnit>;
    width: DimensionValue<WidthUnit>;
  };
}

export const DEFAULT_BLANK_SECTION_CONTENT: BlankSectionContent = {
  inputs: {},
  styles: {
    height: { value: 1, unit: 'rem' },
    width: { value: 100, unit: '%' }
  }
};
