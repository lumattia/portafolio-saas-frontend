import { Component, computed, input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent extends BaseInputComponent {
  placeholderKey = input<string>('');
  type = input<string>('text');
  minLength = input<number | undefined>(undefined);
  maxLength = input<number | undefined>(undefined);
  pattern = input<RegExp | undefined>(undefined);

   protected override readonly validators = computed(() => {
    const v = [];
    if (this.required()) v.push(Validators.required);
    if (this.minLength() !== undefined) v.push(Validators.minLength(this.minLength()!));
    if (this.maxLength() !== undefined) v.push(Validators.maxLength(this.maxLength()!));
    if (this.pattern() !== undefined) v.push(Validators.pattern(this.pattern()!));
    return v;
  });

  get errorMessage(): { key: string; params?: any } | null {
    if (!this.shouldShowError) return null;

    if (this.control.hasError('required')) return { key: 'validation.required' };
    if (this.control.hasError('minlength')) return {key: 'validation.minLength', params: { minLength: this.control.getError('minlength').requiredLength }};
    if (this.control.hasError('maxlength')) return {key: 'validation.maxLength', params: { maxLength: this.control.getError('maxlength').requiredLength }};
    if (this.control.hasError('pattern')) return { key: 'validation.pattern' };
    if (this.control.hasError('email')) return { key: 'validation.email' };
    return { key: 'validation.invalid' };
  }
}
