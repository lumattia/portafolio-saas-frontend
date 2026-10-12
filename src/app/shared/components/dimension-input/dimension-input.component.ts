import { Component, input, model, computed, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInputComponent } from '../inputs/number-input/number-input.component';
import { SelectInputComponent } from '../inputs/select-input/select-input.component';
import { IdName } from '../../../core/models/common.models';
import { DimensionValue } from '../../../core/models/dimension.model';

export type DimensionType = 'width' | 'height';

@Component({
  selector: 'app-dimension-input',
  standalone: true,
  imports: [CommonModule, NumberInputComponent, SelectInputComponent],
  templateUrl: './dimension-input.component.html',
  styleUrls: ['./dimension-input.component.scss']
})
export class DimensionInputComponent {
  dimensionType = input.required<DimensionType>();
  label = input<string>('');
  dimension = model.required<DimensionValue>();
  disabledUnits = input<string[]>([]);
  rangeOverrides = input<Record<string, { min?: number; max?: number }>>({});
  autoClamp = input<boolean>(true);
  visible = input<boolean>(true);
  sectionId = input<string | null>(null);

  private readonly widthUnitOptions: IdName[] = [
    { id: 'px', name: 'px' },
    { id: 'rem', name: 'rem' },
    { id: 'em', name: 'em' },
    { id: '%', name: '%' },
    { id: 'vw', name: 'vw' },
    { id: 'auto', name: 'auto' }
  ];

  private readonly heightUnitOptions: IdName[] = [
    { id: 'px', name: 'px' },
    { id: 'rem', name: 'rem' },
    { id: 'em', name: 'em' },
    { id: '%', name: '%' },
    { id: 'vh', name: 'vh' },
    { id: 'auto', name: 'auto' }
  ];

  private readonly defaultRanges: Record<string, { min: number; max: number }> = {
    px: { min: 0, max: 5000 },
    rem: { min: 0, max: 500 },
    em: { min: 0, max: 500 },
    '%': { min: 0, max: 100 },
    vw: { min: 0, max: 100 },
    vh: { min: 0, max: 100 },
    auto: { min: 0, max: 0 }
  };

  unitOptions = computed(() => {
    const options = this.dimensionType() === 'width'
      ? this.widthUnitOptions
      : this.heightUnitOptions;

    const disabled = this.disabledUnits();
    if (disabled.length === 0) return options;

    return options.filter(opt => !disabled.includes(String(opt.id)));
  });

  defaultLabel = computed(() => {
    return this.dimensionType() === 'width' ? 'Width' : 'Height';
  });

  displayLabel = computed(() => {
    return this.label() || this.defaultLabel();
  });

  currentMin = computed(() => {
    const overrides = this.rangeOverrides()[this.dimension().unit as string];
    const unitKey = this.dimension().unit as keyof typeof this.defaultRanges;
    const defaultRange = this.defaultRanges[unitKey];
    return overrides?.min ?? defaultRange?.min ?? 0;
  });

  currentMax = computed(() => {
    const overrides = this.rangeOverrides()[this.dimension().unit as string];
    const unitKey = this.dimension().unit as keyof typeof this.defaultRanges;
    const defaultRange = this.defaultRanges[unitKey];
    return overrides?.max ?? defaultRange?.max ?? 1000;
  });

  rangeDisplay = computed(() => {
    return `${this.currentMin()} - ${this.currentMax()}`;
  });

  onValueChange(newValue: number | null): void {
    if (newValue !== null) {
      this.dimension.update(curr => ({ ...curr, value: newValue }));
    }
  }

  onUnitChange(newUnit: string): void {
    const newMax = this.defaultRanges[newUnit]?.max ?? 1000;
    const currentValue = this.dimension().value;
    const targetValue = (currentValue && currentValue > newMax) ? newMax : currentValue;

    this.dimension.set({
      value: targetValue,
      unit: newUnit
    });
  }
}
