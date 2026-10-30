import { OnInit, input, model, effect, Directive, Signal, output } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';

@Directive()
export abstract class BaseInputComponent implements OnInit {
  value = model<any>(null);
  labelKey = input<string>('');
  controlInput = input<FormControl | null>(null, { alias: 'control' });
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  showDirtyIndicator = input<boolean>(false);

  control!: FormControl;
  blur = output<void>();

  protected abstract validators: Signal<ValidatorFn[]>;
  protected defaultValue: any = null;

  constructor() {
    effect(() => {
      if (this.control) {
        this.control.setValidators(this.validators());
        this.control.updateValueAndValidity({ emitEvent: false });
      }
    });

    effect(() => {
      this.control.setValue(this.value() ?? this.defaultValue);
      this.control.markAsDirty();
      this.control.markAsTouched();
    });

    effect(() => {
      if (this.disabled() && this.control.enabled) {
        this.control.disable({ emitEvent: false });
      } else if (!this.disabled() && this.control.disabled) {
        this.control.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.control = this.controlInput() ?? new FormControl(this.value() ?? this.defaultValue, this.validators());
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator() && !!this.control?.dirty;
  }

  get shouldShowError(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  onValueChange(event: any): void {
    const inputEl = event.target as HTMLInputElement;
    const newValue = inputEl.value;
    this.value.set(newValue);
  }

  onBlur(): void {
    this.blur.emit();
  }

  abstract get errorMessage(): { key: string; params?: any } | null;
}
