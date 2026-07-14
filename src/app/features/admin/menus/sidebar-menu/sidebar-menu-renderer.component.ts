import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItemRenderer, MenuRenderer } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-sidebar-menu-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-menu-renderer.component.html',
  styleUrls: ['./sidebar-menu-renderer.component.css']
})
export class SidebarMenuRendererComponent {
  private readonly router = inject(Router);
  
  readonly menu = input<MenuRenderer | null>(null);
  
  handleMenuLinkClick(event: MouseEvent, item: MenuItemRenderer): void {
    if (item.subMenuItems.length > 0) {
      item.toggled = !item.toggled;
      return;
    }
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
