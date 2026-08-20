import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItemRenderer, MenuRenderer } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-header-menu-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-menu-renderer.component.html',
  styleUrls: ['./header-menu-renderer.component.css']
})
export class HeaderMenuRendererComponent {
  private readonly router = inject(Router);
  
  readonly menu = input<MenuRenderer | null>(null);
  
  handleMenuLinkClick(event: MouseEvent, item: MenuItemRenderer): void {
    const url = item.url;
    if (!url) return;
    
    if (event.ctrlKey || event.button === 1) {
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
