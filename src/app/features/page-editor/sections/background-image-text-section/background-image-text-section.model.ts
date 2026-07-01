export interface BackgroundImageTextSectionContent {
  inputs: {
    backgroundImage: string;
    text: string;
  };
  styles: {};
}
export function createDefaultBackgroundImageTextContent(partial?: BackgroundImageTextSectionContent): BackgroundImageTextSectionContent {
  return {
    inputs: {
      backgroundImage: partial?.inputs?.backgroundImage ?? '',
      text: partial?.inputs?.text ?? ''
    },
    styles: partial?.styles ?? {}
  };
}