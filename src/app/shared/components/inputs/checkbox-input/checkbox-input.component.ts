import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkbox-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.css'],
})
export class CheckboxInputComponent implements OnInit {
  @Input() labelKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: boolean = false;
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  @Output() valueChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (!this.control) {
      const validators = [];
      if (this.required) {
        validators.push(Validators.requiredTrue);
      }
      this.control = new FormControl(this.value, validators);
    }
  }
  ngOnChanges(): void{
    if (this.control) {
      this.control.setValue(this.value);
    }
  }
  get isRequired(): boolean {
    return this.control?.hasValidator(Validators.requiredTrue) ?? false;
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

    return { key: this.errorKey || 'validation.invalid' };
  }

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.checked;
    this.control!.setValue(newValue);
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
