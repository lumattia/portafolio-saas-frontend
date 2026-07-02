export interface CarouselSectionContent {
  inputs: {};
  styles: {
    height: number;
  };
}
export function createDefaultCarouselSectionContent(partial?: CarouselSectionContent): CarouselSectionContent {
  return {
    inputs: partial?.inputs ?? {},
    styles: {
      height: partial?.styles?.height ?? 300
    }
  };
}