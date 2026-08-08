import { FileInfoResponse } from "./common.models";

export interface PageRequest {
  id?: string;
  title: string;
  slug: string;
  metaDescription: string;
  sections?: SectionRequest[];
}

export interface SectionRequest {
  id: string;
  sectionTemplateId?: string;
  contentJson: any;
  file?: File;
  isEnabled: boolean;
  isDeleted: boolean;
  order:number;
  parentSectionId?: string;
}

export interface PageRenderer {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  isEnabled: boolean;
  isDeleted: boolean;
  sections: SectionRenderer[];
}

export interface SectionRenderer {
  id: string;
  sectionTemplateId?: string;
  componentSelector: string;
  contentJson: any;
  isEnabled: boolean;
  isDeleted: boolean;
  isPublished: boolean;
  parentSectionId?: string;
  subSections: SectionRenderer[];
  subSectionIndex?: number;
  file?: FileInfoResponse;
  fileRequest?: File;
  imageUrl?: string;
}
