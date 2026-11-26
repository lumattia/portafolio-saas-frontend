import { Type } from '@angular/core';
import { backgroundImageTextSectionDefinition } from '../../features/page-editor/sections/background-image-text-section/background-image-text-section.model';
import { blankSectionDefinition } from '../../features/page-editor/sections/blank-section/blank-section.model';
import { carouselSectionDefinition } from '../../features/page-editor/sections/carousel-section/carousel-section.model';
import { flexLayoutSectionDefinition } from '../../features/page-editor/sections/flex-layout-section/flex-layout-section.model';
import { imageSectionDefinition } from '../../features/page-editor/sections/image-section/image-section.model';
import { imageTextSectionDefinition } from '../../features/page-editor/sections/image-text-section/image-text-section.model';
import { richTextSectionDefinition } from '../../features/page-editor/sections/rich-text-section/rich-text-section.model';
export interface SectionDefinition {
  render: () => Promise<Type<unknown>>;
  editor: () => Promise<Type<unknown>>;
  defaultContent: unknown;
}

export const SECTION_REGISTRY = {
  'background-image-text': backgroundImageTextSectionDefinition,
  'blank': blankSectionDefinition,
  'carousel': carouselSectionDefinition,
  'flex': flexLayoutSectionDefinition,
  'image': imageSectionDefinition,
  'image-text': imageTextSectionDefinition,
  'rich-text': richTextSectionDefinition,
} satisfies Record<string, SectionDefinition>;

export type SectionSelector = keyof typeof SECTION_REGISTRY;

export function getSectionDefinition(selector: string): SectionDefinition | undefined {
  return (SECTION_REGISTRY as Record<string, SectionDefinition>)[selector];
}
