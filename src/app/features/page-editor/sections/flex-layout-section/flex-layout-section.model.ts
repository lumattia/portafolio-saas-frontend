import { BaseSectionContent } from '../base-section.component';

export interface FlexLayoutSectionContent extends BaseSectionContent {
  inputs: {};
  styles: {
    gap: number;
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  };
}

export const DEFAULT_FLEX_LAYOUT_SECTION_CONTENT: FlexLayoutSectionContent = {
  inputs: {},
  styles: {
    gap: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }
};
