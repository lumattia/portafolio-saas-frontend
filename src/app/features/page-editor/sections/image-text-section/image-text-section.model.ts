export interface ImageTextSectionContent {
  inputs: {
    text: string;
  };
  styles: {
    imagePosition: 'top-left' | 'top-right';
  };
}

export function createDefaultImageTextSectionContent(partial?: ImageTextSectionContent): ImageTextSectionContent {
  return {
    inputs: {
      text: partial?.inputs?.text ?? '',
    },
    styles: {
      imagePosition: partial?.styles?.imagePosition ?? 'top-left',
    }
  };
}
