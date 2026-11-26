import { Type } from '@angular/core';
import { ImageSectionRenderComponent } from '../../features/page-editor/sections/image-section/image-section-render.component';
import { RichTextSectionRenderComponent } from '../../features/page-editor/sections/rich-text-section/rich-text-section-render.component';
import { ImageTextSectionRenderComponent } from '../../features/page-editor/sections/image-text-section/image-text-section-render.component';
import { BackgroundImageTextSectionRenderComponent } from '../../features/page-editor/sections/background-image-text-section/background-image-text-section-render.component';
import { CarouselSectionRenderComponent } from '../../features/page-editor/sections/carousel-section/carousel-section-render.component';
import { FlexLayoutSectionRenderComponent } from '../../features/page-editor/sections/flex-layout-section/flex-layout-section-render.component';
import { ImageSectionEditorComponent } from '../../features/page-editor/sections/image-section/image-section-editor.component';
import { RichTextSectionEditorComponent } from '../../features/page-editor/sections/rich-text-section/rich-text-section-editor.component';
import { ImageTextSectionEditorComponent } from '../../features/page-editor/sections/image-text-section/image-text-section-editor.component';
import { BackgroundImageTextSectionEditorComponent } from '../../features/page-editor/sections/background-image-text-section/background-image-text-section-editor.component';
import { CarouselSectionEditorComponent } from '../../features/page-editor/sections/carousel-section/carousel-section-editor.component';
import { FlexLayoutSectionEditorComponent } from '../../features/page-editor/sections/flex-layout-section/flex-layout-section-editor.component';
import { BlankSectionEditorComponent } from '../../features/page-editor/sections/blank-section/blank-section-editor.component';
import { BlankSectionRenderComponent } from '../../features/page-editor/sections/blank-section/blank-section-render.component';
import { DEFAULT_BLANK_SECTION_CONTENT } from '../../features/page-editor/sections/blank-section/blank-section.model';
import { DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT } from '../../features/page-editor/sections/background-image-text-section/background-image-text-section.model';
import { DEFAULT_CAROUSEL_SECTION_CONTENT } from '../../features/page-editor/sections/carousel-section/carousel-section.model';
import { DEFAULT_FLEX_LAYOUT_SECTION_CONTENT } from '../../features/page-editor/sections/flex-layout-section/flex-layout-section.model';
import { DEFAULT_IMAGE_SECTION_CONTENT } from '../../features/page-editor/sections/image-section/image-section.model';
import { DEFAULT_IMAGE_TEXT_SECTION_CONTENT } from '../../features/page-editor/sections/image-text-section/image-text-section.model';
import { DEFAULT_RICH_TEXT_SECTION_CONTENT } from '../../features/page-editor/sections/rich-text-section/rich-text-section.model';

export const RENDER_COMPONENT_MAP: Record<string, Type<any>> = {
  'image': ImageSectionRenderComponent,
  'rich-text': RichTextSectionRenderComponent,
  'image-text': ImageTextSectionRenderComponent,
  'background-image-text': BackgroundImageTextSectionRenderComponent,
  'carousel': CarouselSectionRenderComponent,
  'flex': FlexLayoutSectionRenderComponent,
  'blank': BlankSectionRenderComponent,
};

export const EDITOR_COMPONENT_MAP: Record<string, Type<any>> = {
  'image': ImageSectionEditorComponent,
  'rich-text': RichTextSectionEditorComponent,
  'image-text': ImageTextSectionEditorComponent,
  'background-image-text': BackgroundImageTextSectionEditorComponent,
  'carousel': CarouselSectionEditorComponent,
  'flex': FlexLayoutSectionEditorComponent,
  'blank': BlankSectionEditorComponent,
};

export const SECTION_CONTENT_DEFAULTS: Record<string, any> = {
  'blank': DEFAULT_BLANK_SECTION_CONTENT,
  'background-image-text': DEFAULT_BACKGROUND_IMAGE_TEXT_SECTION_CONTENT,
  'carousel': DEFAULT_CAROUSEL_SECTION_CONTENT,
  'flex': DEFAULT_FLEX_LAYOUT_SECTION_CONTENT,
  'image': DEFAULT_IMAGE_SECTION_CONTENT,
  'image-text': DEFAULT_IMAGE_TEXT_SECTION_CONTENT,
  'rich-text': DEFAULT_RICH_TEXT_SECTION_CONTENT,
};
