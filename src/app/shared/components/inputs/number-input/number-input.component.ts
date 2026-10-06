import { Component, Input, Output, EventEmitter, OnInit, Renderer2, ElementRef, inject, ViewChild, SimpleChanges, model, input, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements OnInit {
  private renderer = inject(Renderer2);
  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  value = model<number | null>(null);
  labelKey = input<string>('');
  placeholderKey = input<string>('');
  controlInput = input<FormControl | null>(null, { alias: 'control' });
  decimalPlaces = input<number>(0);
  unit = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  errorKey = input<string>('');
  showDirtyIndicator = input<boolean>(false);
  autoClamp = input<boolean>(false);

  control!: FormControl;

  private _lastValidRawString = '';

  set lastValidRawString(value: string) {
    this._lastValidRawString = value;
    this.renderer.setProperty(this.inputEl.nativeElement, 'value', this.lastValidRawString);
  }

  get lastValidRawString(): string {
    return this._lastValidRawString;
  }

  readonly step = computed(() => {
    const decimals = this.decimalPlaces();
    return decimals > 0 ? `0.${'0'.repeat(decimals - 1)}1` : '1';
  });

  private readonly validators = computed(() => {
    const v = [];
    if (this.required()) v.push(Validators.required);
    if (this.min() !== undefined) v.push(Validators.min(this.min()!));
    if (this.max() !== undefined) v.push(Validators.max(this.max()!));
    return v;
  });

  constructor() {
    effect(() => {
      if (this.control) {
        this.control.setValidators(this.validators());
        this.control.updateValueAndValidity();
        if (this.autoClamp()) {
          this.processClamp();
          this.emitNewValue();
        }
      }
    });

    effect(() => {
      const newVal = this.value();
      if (this.control && newVal !== this.control.value) {
        this.lastValidRawString = newVal !== null && newVal !== undefined ? newVal.toString() : '';
        this.control.setValue(newVal, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.control = this.controlInput() ?? new FormControl(this.value() ?? null, this.validators());
    this.lastValidRawString = this.control.value?.toString() ?? '';
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator() && !!this.control?.dirty;
  }

  get shouldShowError(): boolean {
    if (!this.control) return false;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessage(): { key: string; params?: any } | null {
    if (!this.control || !this.shouldShowError) return null;

    if (this.control.hasError('required')) {
      return { key: this.errorKey() || 'validation.required' };
    }
    if (this.control.hasError('min')) {
      const details = this.control.getError('min');
      return { key: this.errorKey() || 'validation.min', params: { min: details.min } };
    }
    if (this.control.hasError('max')) {
      const details = this.control.getError('max');
      return { key: this.errorKey() || 'validation.max', params: { max: details.max } };
    }
    return { key: this.errorKey() || 'validation.invalid' };
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled() || this.readonly()) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.stepBy(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.stepBy(-1);
    }
  }

  onWheel(event: WheelEvent): void {
    if (this.disabled() || this.readonly()) return;
    if (document.activeElement !== this.inputEl.nativeElement) return;
    event.preventDefault();
    this.stepBy(event.deltaY < 0 ? 1 : -1);
  }

  private stepBy(direction: number): void {
    const decimals = this.decimalPlaces();
    const stepVal = decimals > 0 ? Math.pow(10, -decimals) : 1;
    let currentVal = parseFloat(this.lastValidRawString);

    if (isNaN(currentVal)) {
      const minVal = this.min();
      currentVal = minVal !== undefined && minVal > 0 ? minVal : 0;
    } else {
      currentVal += direction * stepVal;
    }

    if (decimals > 0) {
      currentVal = parseFloat(currentVal.toFixed(decimals));
    }

    this.lastValidRawString = currentVal.toString();
    this.control?.setValue(this.lastValidRawString);
    this.processClamp();
    this.emitNewValue();
  }

  onValueChange(event: Event): void {
    if (this.lastValidRawString === '-' || this.lastValidRawString === '+') {
      this.lastValidRawString = '';
    }
    this.emitNewValue();
  }

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const rawValue = inputEl.value;

    if (rawValue === '' || rawValue === '-' || rawValue === '+') {
      this.lastValidRawString = rawValue;
      this.emitNewValue();
      return;
    }

    if (!this.isValidPattern(rawValue)) {
      this.renderer.setProperty(this.inputEl.nativeElement, 'value', this.lastValidRawString);
      return;
    }

    this.lastValidRawString = rawValue;
    this.processClamp();
    this.emitNewValue();
  }

  private processClamp(): void {
    if (!this.autoClamp()) return;

    const numericValue = parseFloat(this.lastValidRawString);
    if (isNaN(numericValue)) return;

    let finalValue = numericValue;
    const effectiveMin = this.min();
    const effectiveMax = this.max();

    if (effectiveMin !== undefined && finalValue < effectiveMin) finalValue = effectiveMin;
    if (effectiveMax !== undefined && finalValue > effectiveMax) finalValue = effectiveMax;

    if (finalValue !== numericValue) {
      this.lastValidRawString = finalValue.toString();
    }
  }

  private isValidPattern(val: string): boolean {
    const decimals = this.decimalPlaces();
    if (decimals === 0) {
      return /^[-+]?\d*$/.test(val);
    }
    const regex = new RegExp(`^[-+]?\\d*(\\.\\d{0,${decimals}})?$`);
    return regex.test(val);
  }

  private emitNewValue(): void {
    const numericValue = parseFloat(this.lastValidRawString);
    const finalValue = isNaN(numericValue) ? null : numericValue;

    this.value.set(finalValue);
    if (this.control?.value !== finalValue) {
      this.control?.setValue(this.lastValidRawString, { emitEvent: false });
    }
  }
}
