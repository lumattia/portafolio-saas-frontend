import { BaseSectionContent } from '../base-section.component';
import { DimensionValue, WidthUnit } from '../dimension.model';

export interface RichTextSectionContent extends BaseSectionContent {
  inputs: {
    text: string;
  };
  styles: {
    width: DimensionValue<WidthUnit>;
  };
}

export const DEFAULT_RICH_TEXT_SECTION_CONTENT: RichTextSectionContent = {
  inputs: {
    text: '',
  },
  styles: { width: { value: 100, unit: '%' } },
};
