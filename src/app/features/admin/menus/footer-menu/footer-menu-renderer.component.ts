import { Component, input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuRenderer } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-footer-menu-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-menu-renderer.component.html',
  styleUrls: ['./footer-menu-renderer.component.css']
})
export class FooterMenuRendererComponent {
  private readonly router = inject(Router);
  
  readonly menu = input<MenuRenderer | null>(null);
  readonly hoveredItem = signal<string | null>(null);
  
  setHover(itemId: string | null): void {
    this.hoveredItem.set(itemId);
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
