import { SectionDto, SectionRequest } from './section.model';

export interface PageDto {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  isHomePage: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PageDetailDto extends PageDto {
  sections: SectionDto[];
}

export interface PageRequest {
  id?: string;
  title: string;
  slug: string;
  metaDescription: string;
  sections?: SectionRequest[];
}
