export interface FlexLayoutSectionContent {
  inputs: {
  };
  styles: {
    gap: number;
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  };
}
export function createDefaultFlexLayoutSectionContent(partial?: FlexLayoutSectionContent): FlexLayoutSectionContent {
  return {
    inputs: partial?.inputs ?? {},
    styles: partial?.styles ?? {
      gap: 0,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    }
  };
}
