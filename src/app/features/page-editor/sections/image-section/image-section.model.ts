export interface ImageSectionContent {
  inputs: {
  };
  styles: {};
}
export function createDefaultImageSectionContent(partial?: ImageSectionContent): ImageSectionContent {
  return {
    inputs: {
    },
    styles: partial?.styles ?? {}
  };
}
