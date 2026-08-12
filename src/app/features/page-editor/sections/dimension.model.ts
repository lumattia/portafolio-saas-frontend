export type HeightUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'auto';
export type WidthUnit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'auto';

export interface DimensionValue<T extends string = string> {
  value: number;
  unit: T;
}
