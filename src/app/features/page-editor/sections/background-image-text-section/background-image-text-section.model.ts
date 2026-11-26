import { BaseSectionContent } from '../base-section.component';
import type { SectionDefinition } from '../../../../core/constants/component-maps';
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

const DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT: BackgroundImageTextSectionContent = {
  inputs: {
    text: '',
    media:{
        width:{ value: 100, unit: '%' },
        height:{ value: 100, unit: '%' }
    } 
  },
  styles: { width: { value: 100, unit: '%' } }
};

export const backgroundImageTextSectionDefinition: SectionDefinition = {
  render: () => import('./background-image-text-section-render.component').then(m => m.BackgroundImageTextSectionRenderComponent),
  editor: () => import('./background-image-text-section-editor.component').then(m => m.BackgroundImageTextSectionEditorComponent),
  defaultContent: DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT,
};
