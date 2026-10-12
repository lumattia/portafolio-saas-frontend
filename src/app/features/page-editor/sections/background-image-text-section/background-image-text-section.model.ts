import { BaseSectionContent } from '../base-section.component';
import { BoxDimensions, DimensionValue, WidthUnit } from '../../../../core/models/dimension.model';

export interface BackgroundImageTextSectionContent extends BaseSectionContent {
  inputs: {
    text: string;
  };
  styles: {
    width: DimensionValue<WidthUnit>;
  };
}

export const DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT: BackgroundImageTextSectionContent = {
  inputs: {
    text: ''
  },
  styles: { width: { value: 100, unit: '%' } }
};
