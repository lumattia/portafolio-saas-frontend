export interface SectionDto {
  id: string;
  sectionTemplateId: string;
  componentSelector: string;
  contentJson: any;
  order: number;
  isEnabled: boolean;
  isDeleted: boolean;
  parentSectionId?: string;
  subSections: SectionDto[];
}

export interface CreateSectionRequest {
  sectionTemplateId: string;
}

export interface UpdateSectionRequest {
  content: string;
  order: number;
  isEnabled: boolean;
}
