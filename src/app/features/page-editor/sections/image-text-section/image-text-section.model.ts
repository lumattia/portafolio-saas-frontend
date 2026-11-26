import { BaseSectionContent } from '../base-section.component';
import type { SectionDefinition } from '../../../../core/constants/component-maps';
import { DimensionValue, WidthUnit, BoxDimensions } from '../../../../core/models/dimension.model';

export interface ImageTextSectionContent extends BaseSectionContent {
  inputs: {
    text: string;
    media: BoxDimensions;
  };
  styles: {
    imagePosition: 'top-left' | 'top-right';
    width: DimensionValue<WidthUnit>;
  };
}

const DEFAULT_IMAGE_TEXT_SECTION_CONTENT: ImageTextSectionContent = {
  inputs: {
    text: '',
    media:{
      width:{ value: 100, unit: '%' },
      height:{ value: 100, unit: '%' }
    } 
  },
  styles: {
    imagePosition: 'top-left',
    width: { value: 100, unit: '%' },
  }
};

export const imageTextSectionDefinition: SectionDefinition = {
  render: () => import('./image-text-section-render.component').then(m => m.ImageTextSectionRenderComponent),
  editor: () => import('./image-text-section-editor.component').then(m => m.ImageTextSectionEditorComponent),
  defaultContent: DEFAULT_IMAGE_TEXT_SECTION_CONTENT,
};
