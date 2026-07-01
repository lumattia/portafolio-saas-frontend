import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.css'],
})
export class ColorInputComponent implements OnInit {
  @Input() labelKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: string | null = null;
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  @Output() valueChange = new EventEmitter<string>();

  private hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  ngOnInit(): void {
    if (!this.control) {
      const validators = [];
      if (this.required) {
        validators.push(Validators.required);
      }
      validators.push(Validators.pattern(this.hexColorRegex));
      
      this.control = new FormControl(this.value ?? '#000000', validators);
    }
  }

  get isRequired(): boolean {
    return this.control?.hasValidator(Validators.required) ?? false;
  }

  get isValid(): boolean {
    return this.hexColorRegex.test(this.control?.value || '');
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
    if (this.control.hasError('pattern')) {
      return { key: this.errorKey || 'validation.pattern' };
    }

    return { key: this.errorKey || 'validation.invalid' };
  }

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.control!.setValue(newValue);
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
