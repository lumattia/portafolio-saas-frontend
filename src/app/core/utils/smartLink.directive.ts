import { Directive, HostListener, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemRenderer } from '../models/menu.model';

@Directive({
  selector: 'a[smartLink]',
  standalone: true
})
export class SmartLinkDirective {
  private router = inject(Router);

  item = input<MenuItemRenderer | string | undefined | null>(null, { alias: 'smartLink' });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const currentItem = this.item();
    if (!currentItem) return;

    if (typeof currentItem === 'object') {
      if (currentItem.subMenuItems && currentItem.subMenuItems.length > 0) {
        event.preventDefault();
        currentItem.toggled = !currentItem.toggled;
        return;
      }

      this.navigate(event, currentItem.url);
      return;
    }

    this.navigate(event, currentItem);
  }

  private navigate(event: MouseEvent, url: string | undefined): void {
    if (!url) return;

    if (event.ctrlKey || event.metaKey || event.button === 1) {
      return;
    }

    event.preventDefault();

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      this.router.navigateByUrl(url);
    }
  }
}
