import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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

  @Output() valueChange = new EventEmitter<number>();

  ngOnInit(): void {
    if (!this.control) {
      const validators = [];
      if (this.required) {
        validators.push(Validators.required);
      }
      if (this.min !== undefined) {
        validators.push(Validators.min(this.min));
      }
      if (this.max !== undefined) {
        validators.push(Validators.max(this.max));
      }
      
      this.control = new FormControl(this.value ?? 0, validators);
    }
  }

  get isRequired(): boolean {
    return this.control?.hasValidator(Validators.required) ?? false;
  }

  get step(): string {
    return this.decimalPlaces > 0 ? `0.${'0'.repeat(this.decimalPlaces - 1)}1` : '1';
  }

  get displayValue(): string {
    const value = this.control?.value || 0;
    return this.decimalPlaces > 0
      ? value.toFixed(this.decimalPlaces)
      : value.toString();
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

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value ? parseFloat(input.value) : null;
    this.control!.setValue(newValue);
    this.value = newValue ?? 0;
    this.valueChange.emit(newValue ?? 0);
  }
}
