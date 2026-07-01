
export interface SectionTemplateDto {
  id: string;
  componentSelector: string;
  name: string;
  categoryTags: string;
  previewImageUrl?: string;
  defaultContentJson: string;
}

export interface SectionTemplateFilterRequest {
  name?: string;
  categoryTags?: string;
}
