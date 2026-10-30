import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-checkbox-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.scss'],
})
export class CheckboxInputComponent extends BaseInputComponent {
  protected override readonly validators = computed(() => {
    return this.required() ? [Validators.requiredTrue] : [];
  });

  get errorMessage(): { key: string; params?: any } | null {
    if (!this.shouldShowError) return null;

    if (this.control.hasError('required')) return { key: 'validation.required' };
    return { key: 'validation.invalid' };
  }
  override onValueChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const newValue = inputEl.checked;
    this.value.set(newValue);
  }
}
