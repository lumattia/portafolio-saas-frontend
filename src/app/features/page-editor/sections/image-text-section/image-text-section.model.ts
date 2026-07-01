export interface ImageTextSectionContent {
  inputs: {
    image: string;
    text: string;
  };
  styles: {
    imagePosition: 'top-left' | 'top-right';
  };
}

export function createDefaultImageTextSectionContent(partial?: ImageTextSectionContent): ImageTextSectionContent {
  return {
    inputs: {
      image: partial?.inputs?.image ?? '',
      text: partial?.inputs?.text ?? '',
    },
    styles: {
      imagePosition: partial?.styles?.imagePosition ?? 'top-left',
    }
  };
}