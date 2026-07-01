export interface ImageSectionContent {
  inputs: {
    image: string;
  };
  styles: {};
}
export function createDefaultImageSectionContent(partial?: ImageSectionContent): ImageSectionContent {
  return {
    inputs: {
      image: partial?.inputs?.image ?? '',
    },
    styles: partial?.styles ?? {}
  };
}