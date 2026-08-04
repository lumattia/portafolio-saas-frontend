import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collapsible',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible.component.html',
  styleUrl: './collapsible.component.css',
})
export class CollapsibleComponent {
  checked = model(false);
  label = input('');
  disabled = input(false);
  changed = output<boolean>();

  toggle(): void {
    this.checked.set(!this.checked());
    this.changed.emit(this.checked());
  }
}
