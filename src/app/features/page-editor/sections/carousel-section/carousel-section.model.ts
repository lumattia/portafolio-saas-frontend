import { BaseSectionContent } from '../base-section.component';
import { DimensionValue, HeightUnit, WidthUnit } from '../dimension.model';

export interface CarouselSectionContent extends BaseSectionContent {
  inputs: {};
  styles: {
    width: DimensionValue<WidthUnit>;
    height: DimensionValue<HeightUnit>;
  };
}

export const DEFAULT_CAROUSEL_SECTION_CONTENT: CarouselSectionContent = {
  inputs: {},
  styles: {
    width: { value: 100, unit: '%' },
    height: { value: 300, unit: 'px' }
  }
};
