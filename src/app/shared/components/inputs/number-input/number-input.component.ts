import { Component, Input, Output, EventEmitter, OnInit, Renderer2, ElementRef, inject, ViewChild, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent implements OnInit {
  private renderer = inject(Renderer2);
  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: number | null = null;
  @Input() decimalPlaces = 0;
  @Input() unit = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() min?: number;
  @Input() max?: number;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;
  @Input() autoClamp = false;

  @Output() valueChange = new EventEmitter<number | null>();

  private _lastValidRawString = '';

  set lastValidRawString(value: string) {
    this._lastValidRawString = value;
    this.renderer.setProperty(this.inputEl.nativeElement, 'value', this.lastValidRawString);
  }

  get lastValidRawString(): string {
    return this._lastValidRawString;
  }
  ngOnInit(): void {
    if (!this.control) {
     this.control = new FormControl(this.value ?? null, this.buildValidators());
    }
    this.lastValidRawString = this.control.value;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // 1. Si cambian las reglas de validación y ya existe el FormControl
    if (this.control && (changes['min'] || changes['max'] || changes['required'])) {
      this.control.setValidators(this.buildValidators());
      this.control.updateValueAndValidity();
      if (this.autoClamp) {
        this.processClamp();
        this.emitNewValue();
      }
      // Si se activa autoClamp, re-evaluar el límite actual con las nuevas reglas
    }

    // 2. Si el padre cambia la propiedad [value] desde fuera
    if (changes['value'] && !changes['value'].firstChange) {
      const newVal = changes['value'].currentValue;
      if (newVal !== this.control?.value) {
        this.lastValidRawString = newVal !== null && newVal !== undefined ? newVal.toString() : '';
        this.control?.setValue(newVal, { emitEvent: false });
        this.renderer.setProperty(this.inputEl.nativeElement, 'value', newVal);
      }
    }
  }
  private buildValidators() {
    const validators = [];
    if (this.required) validators.push(Validators.required);
    if (this.min !== undefined) validators.push(Validators.min(this.min));
    if (this.max !== undefined) validators.push(Validators.max(this.max));
    return validators;
  }
  get isRequired(): boolean {
    return this.control?.hasValidator(Validators.required) ?? false;
  }

  get step(): string {
    return this.decimalPlaces > 0 ? `0.${'0'.repeat(this.decimalPlaces - 1)}1` : '1';
  }

  get displayValue(): string {
    const val = this.control?.value;
    if (val === null || val === undefined) return '';
    return this.decimalPlaces > 0 ? val.toFixed(this.decimalPlaces) : val.toString();
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator && !!this.control?.dirty;
  }

  get shouldShowError(): boolean {
    if (!this.control) return false;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessage(): { key: string; params?: any } | null {
    if (!this.control || !this.shouldShowError) return null;

    if (this.control.hasError('required')) {
      return { key: this.errorKey || 'validation.required' };
    }
    if (this.control.hasError('min')) {
      const errorDetails = this.control.getError('min');
      return {
        key: this.errorKey || 'validation.min',
        params: { min: errorDetails.min }
      };
    }

    if (this.control.hasError('max')) {
      const errorDetails = this.control.getError('max');
      return {
        key: this.errorKey || 'validation.max',
        params: { max: errorDetails.max }
      };
    }

    return { key: this.errorKey || 'validation.invalid' };
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.stepBy(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.stepBy(-1);
    }
  }

  onWheel(event: WheelEvent): void {
    if (this.disabled || this.readonly) return;
    if (document.activeElement !== this.inputEl.nativeElement) return;

    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    this.stepBy(direction);
  }

private stepBy(direction: number): void {
  // Calcular el incremento según los decimales (ej: 0.1 si decimalPlaces = 1)
  const step = this.decimalPlaces > 0 ? Math.pow(10, -this.decimalPlaces) : 1;

  let currentVal = parseFloat(this.lastValidRawString);

  let min = this.control?.getError('min')?.min;
  if (isNaN(currentVal)) {
    currentVal = min !== undefined && min > 0 ? min : 0;
  } else {
    currentVal += direction * step;
  }

  // Corregir imprecisiones de coma flotante en JavaScript (ej. 0.1 + 0.2 = 0.30000000000000004)
  if (this.decimalPlaces > 0) {
    currentVal = parseFloat(currentVal.toFixed(this.decimalPlaces));
  }

  this.lastValidRawString = currentVal.toString();
  this.control?.setValue(this.lastValidRawString)
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
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;

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
    if (!this.autoClamp) return;

    const numericValue = parseFloat(this.lastValidRawString);
    if (isNaN(numericValue)) return;

    let finalValue = numericValue;
    const effectiveMin = this.control?.getError('min')?.min;
    const effectiveMax = this.control?.getError('max')?.max;

    if (effectiveMin !== undefined && finalValue < effectiveMin) {
      finalValue = effectiveMin;
    }
    if (effectiveMax !== undefined && finalValue > effectiveMax) {
      finalValue = effectiveMax;
    }

    if (finalValue !== numericValue) {
      this.lastValidRawString = finalValue.toString();
    }
  }

  private isValidPattern(val: string): boolean {
    if (this.decimalPlaces === 0) {
      return /^[-+]?\d*$/.test(val);
    }
    const regex = new RegExp(`^[-+]?\\d*(\\.\\d{0,${this.decimalPlaces}})?$`);
    return regex.test(val);
  }

  private emitNewValue(): void {
    const numericValue = parseFloat(this.lastValidRawString);
    const finalValue = isNaN(numericValue) ? null : numericValue;

    this.value = finalValue;
    this.valueChange.emit(finalValue ?? undefined);

    if (this.control?.value !== finalValue) {
      this.control?.setValue(this.lastValidRawString, { emitEvent: false });
    }
  }
}
