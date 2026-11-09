import { Component, input, output, model, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collapsible',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible.component.html',
  styleUrl: './collapsible.component.scss',
})
export class CollapsibleComponent {
  checked = model(false);
  label = input('');
  disabled = input(false);
  changed = output<boolean>();
  constructor() {
    effect(() => {
      if (this.disabled()) {
        this.checked.set(false);
      }
    });
  }
  toggle(): void {
    this.checked.set(!this.checked());
    this.changed.emit(this.checked());
  }
}
