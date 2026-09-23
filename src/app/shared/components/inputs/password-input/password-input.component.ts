import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input.component';
import { ButtonComponent } from '../../button/button.component';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [TextInputComponent, ButtonComponent, IconComponent, ReactiveFormsModule],
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
})
export class PasswordInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() control: FormControl | null = null;
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() minLength = 8;
  @Input() maxLength?: number;
  @Input() pattern?: RegExp;

  showPassword = false;
  type = 'password';

  toggleVisibility(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}
