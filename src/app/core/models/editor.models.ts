import { SectionDto } from "./section.model";

export interface ImageInputConfig {
  maxWidth?: number;
  maxHeight?: number;
  maxScale?: number;
  quality?: number;
  aspectRatio?: number;
}

export interface EditorState {
  sections: SectionDto[];
  selectedSection: SectionDto | null;
  isTemplateSelectorOpen: boolean;
  isEditorOpen: boolean;
  currentSlideIndex: number;
}
