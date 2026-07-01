export interface CarouselSectionContent {
  inputs: {};
  styles: {};
}
export function createDefaultCarouselSectionContent(partial?: CarouselSectionContent): CarouselSectionContent {
  return {
    inputs: partial?.inputs ?? {},
    styles: partial?.styles ?? {}
  };
}