export type HeightUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'auto';
export type WidthUnit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'auto';

export interface DimensionValue<T extends string = string> {
  value: number;
  unit: T;
}

export interface BlankSectionContent {
  inputs: {};
  styles: {
    height: DimensionValue<HeightUnit>;
    width: DimensionValue<WidthUnit>;
  };
}

export function createDefaultBlankSectionContent(partial?: BlankSectionContent): BlankSectionContent {
  return {
    inputs: partial?.inputs ?? {},
    styles: {
      height: partial?.styles?.height ?? { value: 1, unit: 'rem' },
      width: partial?.styles?.width ?? { value: 100, unit: '%' }
    }
  };
}

export const HEIGHT_UNIT_RANGES: Record<HeightUnit, { min: number; max: number }> = {
  'px': { min: 0, max: 5000 },
  'rem': { min: 0, max: 100 },
  'em': { min: 0, max: 100 },
  '%': { min: 0, max: 100 },
  'vh': { min: 0, max: 100 },
  'auto': { min: 0, max: 0 }
};

export const WIDTH_UNIT_RANGES: Record<WidthUnit, { min: number; max: number }> = {
  'px': { min: 0, max: 5000 },
  'rem': { min: 0, max: 100 },
  'em': { min: 0, max: 100 },
  '%': { min: 0, max: 100 },
  'vw': { min: 0, max: 100 },
  'auto': { min: 0, max: 0 }
};

export function clampValue(value: number, unit: string): number {
  const heightRange = HEIGHT_UNIT_RANGES[unit as HeightUnit];
  const widthRange = WIDTH_UNIT_RANGES[unit as WidthUnit];
  const range = heightRange || widthRange;

  if (unit === 'auto') return 0;
  if (!range) return value;

  return Math.max(range.min, Math.min(range.max, value));
}
