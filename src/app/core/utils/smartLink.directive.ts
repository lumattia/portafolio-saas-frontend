import { Directive, HostListener, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemRenderer } from '../models/menu.model';

@Directive({
  selector: 'a[smartLink]', // Se aplica a cualquier <a smartLink="/ruta"> o <a [smartLink]="url">
  standalone: true
})
export class SmartLinkDirective {
  private router = inject(Router);

  @Input('smartLink') item: MenuItemRenderer | string | undefined | null;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.item) return;

    // Caso 1: Se pasó un objeto MenuItemRenderer
    if (typeof this.item === 'object') {
      // Si tiene submenús, alteramos su visibilidad y cancelamos la navegación
      if (this.item.subMenuItems && this.item.subMenuItems.length > 0) {
        event.preventDefault();
        this.item.toggled = !this.item.toggled;
        return;
      }

      this.navigate(event, this.item.url);
      return;
    }

    this.navigate(event, this.item);
  }

  private navigate(event: MouseEvent, url: string | undefined): void {
    if (!url) return;

    // Respetar comportamientos nativos
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
