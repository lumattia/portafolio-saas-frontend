export interface RichTextSectionContent {
  inputs: {
    text: string;
  };
  styles: {};
}
export function createDefaultRichTextSectionContent(partial?: RichTextSectionContent): RichTextSectionContent {
  return {
    inputs: {
      text: partial?.inputs?.text ?? '',
    },
    styles: partial?.styles ?? {},
  };
}