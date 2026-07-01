import { Component, inject, signal, input, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { MenuRequest } from '../../../core/models/menu.model';
import { MenuItem } from '../../../core/models/menu.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss'],
})
export class MenuManagementComponent {
  private readonly menuService = inject(MenuService);
  
  readonly isReadOnly = input(false);
  readonly menus = this.menuService.menus;
  readonly loading = signal(false);
  readonly selectedMenuId = signal<string | null>(null);
  readonly isEditing = signal(false);
  readonly editingItemId = signal<string | null>(null);
  readonly draggedIndex = signal<number | null>(null);
  readonly originalOrder = signal<string[]>([]);

  readonly hasOrderChanged = computed(() => {
    const current = this.menus().map(m => m.id);
    const original = this.originalOrder();
    if (current.length !== original.length) return true;
    return current.some((id, index) => id !== original[index]);
  });

  readonly newItemText = signal('');
  readonly newItemIsExternal = signal(false);
  readonly newItemExternalUrl = signal('');
  readonly newItemPageSlug = signal('');
  readonly showAddModal = signal(false);

  constructor() {
    effect(() => {
      const menuItems = this.menus();
      this.originalOrder.set(menuItems.map(m => m.id));
    });
  }

  resetOrder(): void {
    const originalMenus = this.originalOrder().map(id => this.menus().find(m => m.id === id)!);
    this.menuService.menus.set(originalMenus);
  }

  openAddModal(): void {
    this.resetForm();
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.resetForm();
  }

  selectMenu(menuId: string): void {
    this.selectedMenuId.set(menuId);
  }

  get selectedMenu(): MenuItem | undefined {
    return this.menus().find(m => m.id === this.selectedMenuId());
  }

  onDragStart(event: DragEvent, index: number): void {
    if (this.isReadOnly()) return;
    this.draggedIndex.set(index);
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent): void {
    if (this.isReadOnly()) return;
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    if (this.isReadOnly()) return;
    event.preventDefault();
    
    const dragIndex = this.draggedIndex();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const items = [...this.menus()];
    const [draggedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    
    this.menuService.menus.set(items);
    this.draggedIndex.set(null);
  }

  saveOrder(): void {
    const menuIds = this.menus().map(m => m.id);
    this.menuService.reorder(menuIds).subscribe({
      next: () => {
        this.originalOrder.set(menuIds);
      },
      error: (err: any) => {
        console.error('Failed to save menu order', err);
      },
    });
  }

  addMenuItem(): void {
    if (this.isReadOnly()) return;
    
    const request: MenuRequest = {
      text: this.newItemText(),
      pageSlug: this.newItemPageSlug(),
      externalUrl: this.newItemIsExternal() ? this.newItemExternalUrl() : undefined,
      isExternal: this.newItemIsExternal(),
      order: this.menus().length,
    };
    this.menuService.create(request).subscribe({
      next: () => {
        this.closeAddModal();
      },
      error: (err: any) => {
        console.error('Failed to create menu item', err);
      },
    });
  }

  editMenuItem(item: MenuItem): void {
    if (this.isReadOnly()) return;
    
    this.editingItemId.set(item.id);
    this.newItemText.set(item.text);
    this.newItemIsExternal.set(item.isExternal);
    this.newItemExternalUrl.set(item.externalUrl || '');
    this.newItemPageSlug.set(item.pageSlug);
    this.isEditing.set(true);
    this.showAddModal.set(true);
  }

  updateMenuItem(): void {
    if (this.isReadOnly()) return;
    
    const itemId = this.editingItemId();
    if (!itemId) return;

    const request: MenuRequest = {
      id: itemId,
      text: this.newItemText(),
      pageSlug: this.newItemPageSlug(),
      externalUrl: this.newItemIsExternal() ? this.newItemExternalUrl() : undefined,
      isExternal: this.newItemIsExternal(),
      order: this.selectedMenu?.order || 0,
    };

    this.menuService.update(itemId, request).subscribe({
      next: () => {
        this.closeAddModal();
      },
      error: (err: any) => {
        console.error('Failed to update menu item', err);
      },
    });
  }

  deleteMenuItem(itemId: string): void {
    if (this.isReadOnly()) return;
    
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    this.menuService.delete(itemId).subscribe({
      next: () => {
        // Service manages the signal
      },
      error: (err: any) => {
        console.error('Failed to delete menu item', err);
      },
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.newItemText.set('');
    this.newItemIsExternal.set(false);
    this.newItemExternalUrl.set('');
    this.newItemPageSlug.set('');
    this.editingItemId.set(null);
    this.isEditing.set(false);
  }

  toggleIsExternal(): void {
    this.newItemIsExternal.set(!this.newItemIsExternal());
  }
}
