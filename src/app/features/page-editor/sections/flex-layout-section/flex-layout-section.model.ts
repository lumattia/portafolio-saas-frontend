import { BaseSectionContent } from '../base-section.component';
import type { SectionDefinition } from '../../../../core/constants/component-maps';

export interface FlexLayoutSectionContent extends BaseSectionContent {
  inputs: {};
  styles: {
    gap: number;
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  };
}

const DEFAULT_FLEX_LAYOUT_SECTION_CONTENT: FlexLayoutSectionContent = {
  inputs: {},
  styles: {
    gap: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }
};

export const flexLayoutSectionDefinition: SectionDefinition = {
  render: () => import('./flex-layout-section-render.component').then(m => m.FlexLayoutSectionRenderComponent),
  editor: () => import('./flex-layout-section-editor.component').then(m => m.FlexLayoutSectionEditorComponent),
  defaultContent: DEFAULT_FLEX_LAYOUT_SECTION_CONTENT,
};
