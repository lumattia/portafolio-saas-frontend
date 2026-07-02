export interface SectionDto {
  id: string;
  sectionTemplateId: string;
  componentSelector: string;
  contentJson: any;
  order: number;
  isEnabled: boolean;
  isDeleted: boolean;
  parentSectionId?: string;
  isPublished: boolean;
  subSections: SectionDto[];
  subSectionIndex?: number;
}

export interface SectionRequest {
  id: string;
  sectionTemplateId: string;
  contentJson: any;
  order: number;
  isEnabled: boolean;
  isDeleted: boolean;
  parentSectionId?: string;
}
