import { Component, input, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [TextInputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
})
export class PasswordInputComponent {
  labelKey = input<string>('');
  placeholderKey = input<string>('');
  control = input<FormControl | null>(null);
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  minLength = input<number>(8);
  maxLength = input<number | undefined>(undefined);
  pattern = input<RegExp | undefined>(undefined);

  showPassword = signal<boolean>(false);

  type = computed(() => (this.showPassword() ? 'text' : 'password'));

  toggleVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }
}
