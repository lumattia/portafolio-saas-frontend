import { BaseSectionContent } from '../base-section.component';
import type { SectionDefinition } from '../../../../core/constants/component-maps';
import { DimensionValue, WidthUnit } from '../../../../core/models/dimension.model';

export interface RichTextSectionContent extends BaseSectionContent {
  inputs: {
    text: string;
  };
  styles: {
    width: DimensionValue<WidthUnit>;
  };
}

const DEFAULT_RICH_TEXT_SECTION_CONTENT: RichTextSectionContent = {
  inputs: {
    text: '',
  },
  styles: { width: { value: 100, unit: '%' } },
};

export const richTextSectionDefinition: SectionDefinition = {
  render: () => import('./rich-text-section-render.component').then(m => m.RichTextSectionRenderComponent),
  editor: () => import('./rich-text-section-editor.component').then(m => m.RichTextSectionEditorComponent),
  defaultContent: DEFAULT_RICH_TEXT_SECTION_CONTENT,
};
