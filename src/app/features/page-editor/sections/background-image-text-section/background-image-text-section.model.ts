import { BaseSectionContent } from '../base-section.component';
import { BoxDimensions, DimensionValue, WidthUnit } from '../../../../core/models/dimension.model';

export interface BackgroundImageTextSectionContent extends BaseSectionContent {
  inputs: {
    text: string;
    media: BoxDimensions;
  };
  styles: {
    width: DimensionValue<WidthUnit>;
  };
}

export const DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT: BackgroundImageTextSectionContent = {
  inputs: {
    text: '',
    media:{
        width:{ value: 100, unit: '%' },
        height:{ value: 100, unit: '%' }
    } 
  },
  styles: { width: { value: 100, unit: '%' } }
};
