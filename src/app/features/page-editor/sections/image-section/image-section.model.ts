import { BaseSectionContent } from '../base-section.component';
import { DimensionValue, WidthUnit, BoxDimensions } from '../../../../core/models/dimension.model';

export interface ImageSectionContent extends BaseSectionContent {
  inputs: {
    media: BoxDimensions;
  };
  styles: {
    width: DimensionValue<WidthUnit>;
  };
}

export const DEFAULT_IMAGE_SECTION_CONTENT: ImageSectionContent = {
  inputs: {
    media:{
      width:{ value: 100, unit: '%' },
      height:{ value: 100, unit: '%' }
    }
  },
  styles: { width: { value: 100, unit: '%' } }
};
