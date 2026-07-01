export interface FlexLayoutSectionContent {
  inputs: {
  };
  styles: {
    direction: 'row' | 'column';
    gap: number;
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  };
}
export function createDefaultFlexLayoutSectionContent(partial?: FlexLayoutSectionContent): FlexLayoutSectionContent {
  return {
    inputs: partial?.inputs ?? {},
    styles: partial?.styles ?? {
      direction: 'row',
      gap: 0,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      wrap: 'nowrap'
    }
  };
}