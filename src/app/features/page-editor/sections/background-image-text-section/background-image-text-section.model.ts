export interface BackgroundImageTextSectionContent {
  inputs: {
    text: string;
  };
  styles: {};
}
export function createDefaultBackgroundImageTextContent(partial?: BackgroundImageTextSectionContent): BackgroundImageTextSectionContent {
  return {
    inputs: {
      text: partial?.inputs?.text ?? ''
    },
    styles: partial?.styles ?? {}
  };
}
