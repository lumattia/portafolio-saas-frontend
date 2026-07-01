export interface PublishedSnapshotPageDto {
  version: string;
  title: string;
  slug: string;
  metaDescription: string;
  sections: PublishedSnapshotSectionDto[];
}

export interface PublishedSnapshotSectionDto {
  componentSelector: string;
  contentJson: string;
  order: number;
  subSections: PublishedSnapshotSectionDto[];
}
