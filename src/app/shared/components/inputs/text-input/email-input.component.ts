import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TextInputComponent } from './text-input.component';

@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class EmailInputComponent extends TextInputComponent {
  override labelKey = input<string>('email.label');
  override placeholderKey = input<string>('email.placeholder');
  override pattern = input<RegExp | undefined>( /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
}
