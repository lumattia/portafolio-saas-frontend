import { Component, input, model, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInputComponent } from '../inputs/number-input/number-input.component';
import { SelectInputComponent } from '../inputs/select-input/select-input.component';
import { IdName } from '../../../core/models/common.models';

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
  value = model<number | null>(0);
  unit = model<string>('px');
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
    const overrides = this.rangeOverrides()[this.unit() as string];
    const unitKey = this.unit() as keyof typeof this.defaultRanges;
    const defaultRange = this.defaultRanges[unitKey];
    return overrides?.min ?? defaultRange?.min ?? 0;
  });

  currentMax = computed(() => {
    const overrides = this.rangeOverrides()[this.unit() as string];
    const unitKey = this.unit() as keyof typeof this.defaultRanges;
    const defaultRange = this.defaultRanges[unitKey];
    return overrides?.max ?? defaultRange?.max ?? 1000;
  });

  rangeDisplay = computed(() => {
    return `${this.currentMin()} - ${this.currentMax()}`;
  });

  onValueChange(newValue: number | null): void {
    if (newValue !== null) {
      this.value.set(newValue);
      this.dispatch();
    }
  }

  onUnitChange(newUnit: string): void {
    const newMax = this.defaultRanges[newUnit]?.max ?? 1000;
    const currentValue = this.value();

    // Clamp value to new range if it exceeds (in next tick to avoid ExpressionChangedAfterItHasBeenCheckedError)
    if (currentValue && currentValue > newMax) {
      setTimeout(() => {
        this.value.set(newMax);
      }, 0);
    }

    this.unit.set(newUnit);
    this.dispatch();
  }

  private dispatch(): void {
    if (this.sectionId()) {
      window.dispatchEvent(new CustomEvent('dimension-update', {
        detail: { sectionId: this.sectionId() }
      }));
    }
  }
}
