import { BaseSectionContent } from '../base-section.component';
import type { SectionDefinition } from '../../../../core/constants/component-maps';
import { DimensionValue, HeightUnit, WidthUnit } from '../../../../core/models/dimension.model';

export interface BlankSectionContent extends BaseSectionContent {
  inputs: {};
  styles: {
    height: DimensionValue<HeightUnit>;
    width: DimensionValue<WidthUnit>;
  };
}

const DEFAULT_BLANK_SECTION_CONTENT: BlankSectionContent = {
  inputs: {},
  styles: {
    height: { value: 1, unit: 'rem' },
    width: { value: 100, unit: '%' }
  }
};

export const blankSectionDefinition: SectionDefinition = {
  render: () => import('./blank-section-render.component').then(m => m.BlankSectionRenderComponent),
  editor: () => import('./blank-section-editor.component').then(m => m.BlankSectionEditorComponent),
  defaultContent: DEFAULT_BLANK_SECTION_CONTENT,
};
