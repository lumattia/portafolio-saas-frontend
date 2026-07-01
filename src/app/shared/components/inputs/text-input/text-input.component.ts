import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent implements OnInit {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: any = null;
  @Input() type = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() pattern?: string;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  @Output() valueChange = new EventEmitter<any>();

  ngOnInit(): void {
    if (!this.control) {
      const validators = [];
      if (this.required) {
        validators.push(Validators.required);
      }
      if (this.minLength !== undefined) {
        validators.push(Validators.minLength(this.minLength));
      }
      if (this.maxLength !== undefined) {
        validators.push(Validators.maxLength(this.maxLength));
      }
      if (this.pattern) {
        validators.push(Validators.pattern(this.pattern));
      }
      
      this.control = new FormControl(this.value, validators);
    }
  }

  get isRequired(): boolean {
    return this.control?.hasValidator(Validators.required) ?? false;
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
    if (this.control.hasError('minlength')) {
      const errorDetails = this.control.getError('minlength');
      return { 
        key: this.errorKey || 'validation.minLength', 
        params: { minLength: errorDetails.requiredLength }
      };
    }
    if (this.control.hasError('maxlength')) {
      const errorDetails = this.control.getError('maxlength');
      return { 
        key: this.errorKey || 'validation.maxLength', 
        params: { maxLength: errorDetails.requiredLength }
      };
    }
    if (this.control.hasError('pattern')) {
      return { key: this.errorKey || 'validation.pattern' };
    }
    if (this.control.hasError('email')) {
      return { key: this.errorKey || 'validation.email' };
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
