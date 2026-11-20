import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <span
      [class]="'icon ' + size()"
      [style.--icon-mask]="mask()"
      role="img"
      [attr.aria-label]="name()">
    </span>
  `,
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly mask = computed(() => `url(/assets/icons/${this.name()}.svg)`);
}
