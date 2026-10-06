import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'icon'>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly active = input(false);
  readonly icon = input<string | null>(null);
  readonly onClick = output<MouseEvent>();

  getClasses(): string {
    return `${this.variant()} ${this.size()} ${this.active() ? 'active' : ''}`;
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      event.stopPropagation();
      this.onClick.emit(event);
    }
  }
}
