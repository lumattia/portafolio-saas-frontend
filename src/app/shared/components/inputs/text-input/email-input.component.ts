import { Component, Input } from '@angular/core';
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
  @Input() override labelKey:string = 'email.label';
  @Input() override placeholderKey:string = 'email.placeholder';
  @Input() override pattern?: RegExp =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
}
