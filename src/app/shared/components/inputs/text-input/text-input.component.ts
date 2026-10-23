import { Component, OnInit, input, model, computed, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit {
  value = model<any>(null);

  labelKey = input<string>('');
  placeholderKey = input<string>('');
  controlInput = input<FormControl | null>(null, { alias: 'control' });
  type = input<string>('text');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  minLength = input<number | undefined>(undefined);
  maxLength = input<number | undefined>(undefined);
  pattern = input<RegExp | undefined>(undefined);
  errorKey = input<string>('');
  showDirtyIndicator = input<boolean>(false);

  control!: FormControl;

  private readonly validators = computed(() => {
    const v = [];
    if (this.required()) {
      v.push(Validators.required);
    }
    const min = this.minLength();
    if (min !== undefined) {
      v.push(Validators.minLength(min));
    }
    const max = this.maxLength();
    if (max !== undefined) {
      v.push(Validators.maxLength(max));
    }
    const pat = this.pattern();
    if (pat) {
      v.push(Validators.pattern(pat));
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
      this.control.setValue(this.value());
      this.control.markAsDirty();
      this.control.markAsTouched();
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
    this.control.valueChanges.subscribe((val: any) => {
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
    if (this.control.hasError('minlength')) {
      const errorDetails = this.control.getError('minlength');
      return {
        key: this.errorKey() || 'validation.minLength',
        params: { minLength: errorDetails.requiredLength },
      };
    }
    if (this.control.hasError('maxlength')) {
      const errorDetails = this.control.getError('maxlength');
      return {
        key: this.errorKey() || 'validation.maxLength',
        params: { maxLength: errorDetails.requiredLength },
      };
    }
    if (this.control.hasError('pattern')) {
      return { key: this.errorKey() || 'validation.pattern' };
    }
    if (this.control.hasError('email')) {
      return { key: this.errorKey() || 'validation.email' };
    }

    return { key: this.errorKey() || 'validation.invalid' };
  }

  onValueChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const newValue = inputEl.value;
    this.value.set(newValue);
  }
}
