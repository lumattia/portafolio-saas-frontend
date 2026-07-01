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

export const RENDER_COMPONENT_MAP: Record<string, Type<any>> = {
  'image': ImageSectionRenderComponent,
  'rich-text': RichTextSectionRenderComponent,
  'image-text': ImageTextSectionRenderComponent,
  'background-image-text': BackgroundImageTextSectionRenderComponent,
  'carousel': CarouselSectionRenderComponent,
  'flex-layout': FlexLayoutSectionRenderComponent,
};

export const EDITOR_COMPONENT_MAP: Record<string, Type<any>> = {
  'image': ImageSectionEditorComponent,
  'rich-text': RichTextSectionEditorComponent,
  'image-text': ImageTextSectionEditorComponent,
  'background-image-text': BackgroundImageTextSectionEditorComponent,
  'carousel': CarouselSectionEditorComponent,
  'flex-layout': FlexLayoutSectionEditorComponent,
};
