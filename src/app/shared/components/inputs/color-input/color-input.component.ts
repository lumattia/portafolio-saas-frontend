import { Component, OnInit, input, model, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
})
export class ColorInputComponent implements OnInit {
  value = model<string | null>(null);

  labelKey = input<string>('');
  controlInput = input<FormControl | null>(null, { alias: 'control' });
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  errorKey = input<string>('');
  showDirtyIndicator = input<boolean>(false);

  control!: FormControl;

  private readonly hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  private readonly validators = computed(() => {
    const v = [Validators.pattern(this.hexColorRegex)];
    if (this.required()) {
      v.push(Validators.required);
    }
    return v;
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
        this.control.setValue(newVal ?? '#000000', { emitEvent: false });
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
    this.control = this.controlInput() ?? new FormControl(this.value() ?? '#000000', this.validators());

    this.control.valueChanges.subscribe((val: string | null) => {
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
      return { key: this.errorKey() || 'validation.required' };
    }
    if (this.control.hasError('pattern')) {
      return { key: this.errorKey() || 'validation.pattern' };
    }

    return { key: this.errorKey() || 'validation.invalid' };
  }

  onValueChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const newValue = inputEl.value;

    this.control.setValue(newValue);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.value.set(newValue);
  }
}
