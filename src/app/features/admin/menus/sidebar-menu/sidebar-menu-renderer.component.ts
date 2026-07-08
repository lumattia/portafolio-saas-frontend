import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuRenderer } from '../../../../core/models/menu.model';

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
  readonly expandedItems = signal<Set<string>>(new Set());
  
  toggleExpand(itemId: string): void {
    const current = new Set(this.expandedItems());
    if (current.has(itemId)) {
      current.delete(itemId);
    } else {
      current.add(itemId);
    }
    this.expandedItems.set(current);
  }
  
  handleMenuLinkClick(event: MouseEvent, url: string | undefined): void {
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
