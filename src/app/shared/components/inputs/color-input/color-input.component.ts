import { Component, computed } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
})
export class ColorInputComponent extends BaseInputComponent {
  private readonly hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  protected override defaultValue = '#000000';
  protected override readonly validators = computed(() => {
    const v = [Validators.pattern(this.hexColorRegex)];
    if (this.required()) v.push(Validators.required);
    return v;
  });


  get errorMessage(): { key: string; params?: any } | null {
    if (!this.shouldShowError) return null;

    if (this.control.hasError('required')) return { key: 'validation.required' };
    if (this.control.hasError('pattern')) return { key: 'validation.pattern' };
    return { key: 'validation.invalid' };
  }
}
