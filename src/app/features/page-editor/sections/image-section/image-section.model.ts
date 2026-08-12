import { BaseSectionContent } from '../base-section.component';
import { DimensionValue, WidthUnit } from '../dimension.model';

export interface ImageSectionContent extends BaseSectionContent {
  inputs: {
  };
  styles: {
    width: DimensionValue<WidthUnit>;
  };
}

export const DEFAULT_IMAGE_SECTION_CONTENT: ImageSectionContent = {
  inputs: {},
  styles: { width: { value: 100, unit: '%' } }
};
