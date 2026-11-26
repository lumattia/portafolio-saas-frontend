import { BaseSectionContent } from '../base-section.component';
import type { SectionDefinition } from '../../../../core/constants/component-maps';
import { DimensionValue, HeightUnit, WidthUnit } from '../../../../core/models/dimension.model';

export interface CarouselSectionContent extends BaseSectionContent {
  inputs: {};
  styles: {
    width: DimensionValue<WidthUnit>;
    height: DimensionValue<HeightUnit>;
  };
}

const DEFAULT_CAROUSEL_SECTION_CONTENT: CarouselSectionContent = {
  inputs: {},
  styles: {
    width: { value: 100, unit: '%' },
    height: { value: 300, unit: 'px' }
  }
};

export const carouselSectionDefinition: SectionDefinition = {
  render: () => import('./carousel-section-render.component').then(m => m.CarouselSectionRenderComponent),
  editor: () => import('./carousel-section-editor.component').then(m => m.CarouselSectionEditorComponent),
  defaultContent: DEFAULT_CAROUSEL_SECTION_CONTENT,
};
