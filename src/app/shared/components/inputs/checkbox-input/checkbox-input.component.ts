import { Component, OnInit, input, model, computed, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkbox-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.scss'],
})
export class CheckboxInputComponent implements OnInit {
  value = model<boolean>(false);

  labelKey = input<string>('');
  controlInput = input<FormControl | null>(null, { alias: 'control' });
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  showDirtyIndicator = input<boolean>(false);

  control!: FormControl;

  private readonly validators = computed(() => {
    return this.required() ? [Validators.requiredTrue] : [];
  });

  constructor() {
    effect(() => {
      if (this.control) {
        this.control.setValidators(this.validators());
        this.control.updateValueAndValidity({ emitEvent: false });
      }
    });

    effect(() => {
      const newVal = this.value();
      if (this.control && newVal !== this.control.value) {
        this.control.setValue(newVal, { emitEvent: false });
      }
    });

    effect(() => {
      if (this.control) {
        if (this.disabled() && this.control.enabled) {
          this.control.disable({ emitEvent: false });
        } else if (!this.disabled() && this.control.disabled) {
          this.control.enable({ emitEvent: false });
        }
      }
    });
  }

  ngOnInit(): void {
    this.control = this.controlInput() ?? new FormControl(this.value(), this.validators());

    this.control.valueChanges.subscribe((val: boolean) => {
      if (val !== this.value()) {
        this.value.set(val);
      }
    });
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
      return { key: 'validation.required' };
    }

    return { key: 'validation.invalid' };
  }

  onValueChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const newValue = inputEl.checked;

    this.control.setValue(newValue);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.value.set(newValue);
  }
}
