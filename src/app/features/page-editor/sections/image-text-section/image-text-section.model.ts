import { BaseSectionContent } from '../base-section.component';
import { DimensionValue, WidthUnit } from '../dimension.model';

export interface ImageTextSectionContent extends BaseSectionContent {
  inputs: {
    text: string;
  };
  styles: {
    imagePosition: 'top-left' | 'top-right';
    width: DimensionValue<WidthUnit>;
  };
}

export const DEFAULT_IMAGE_TEXT_SECTION_CONTENT: ImageTextSectionContent = {
  inputs: {
    text: '',
  },
  styles: {
    imagePosition: 'top-left',
    width: { value: 100, unit: '%' },
  }
};
