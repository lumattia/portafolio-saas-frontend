import { BaseSectionContent } from '../base-section.component';
import type { SectionDefinition } from '../../../../core/constants/component-maps';
import { DimensionValue, WidthUnit, BoxDimensions } from '../../../../core/models/dimension.model';

export interface ImageSectionContent extends BaseSectionContent {
  inputs: {
    media: BoxDimensions;
  };
  styles: {
    width: DimensionValue<WidthUnit>;
  };
}

const DEFAULT_IMAGE_SECTION_CONTENT: ImageSectionContent = {
  inputs: {
    media:{
      width:{ value: 100, unit: '%' },
      height:{ value: 100, unit: '%' }
    }
  },
  styles: { width: { value: 100, unit: '%' } }
};

export const imageSectionDefinition: SectionDefinition = {
  render: () => import('./image-section-render.component').then(m => m.ImageSectionRenderComponent),
  editor: () => import('./image-section-editor.component').then(m => m.ImageSectionEditorComponent),
  defaultContent: DEFAULT_IMAGE_SECTION_CONTENT,
};
