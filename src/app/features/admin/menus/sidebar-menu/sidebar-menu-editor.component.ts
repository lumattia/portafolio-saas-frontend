import { Component, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { MenuService } from '../../../../core/services/menu.service';
import { MenuItemRenderer, MenuItemRequest, MenuRenderer, MenuRequest, MenuType } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-sidebar-menu-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './sidebar-menu-editor.component.html',
  styleUrls: ['./sidebar-menu-editor.component.scss']
})
export class SidebarMenuEditorComponent {
  private readonly menuService = inject(MenuService);
  
  readonly menu = model<MenuRenderer>();
  readonly loading = signal(false);
  readonly showAddModal = signal(false);
  readonly editingItem = signal<MenuItemRenderer | null>(null);
  readonly draggedIndex = signal<number | null>(null);
  readonly expandedItems = signal<Set<string>>(new Set());
  
  readonly newItemText = signal('');
  readonly newItemUrl = signal('');
  readonly newItemStyle = signal('');
  readonly newItemParentId = signal<string | undefined>(undefined);
  
  openAddModal(parentId: string | undefined = undefined): void {
    this.resetForm();
    this.newItemParentId.set(parentId);
    this.editingItem.set(null);
    this.showAddModal.set(true);
  }
  
  openEditModal(item: MenuItemRenderer): void {
    this.newItemText.set(item.text);
    this.newItemUrl.set(item.url || '');
    this.newItemParentId.set(item.parentMenuItemId ?? undefined);
    this.editingItem.set(item);
    this.showAddModal.set(true);
  }
  
  closeModal(): void {
    this.showAddModal.set(false);
    this.resetForm();
  }
  
  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex.set(index);
    event.dataTransfer?.setData('text/plain', index.toString());
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  
  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    
    const dragIndex = this.draggedIndex();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const currentMenu = this.menu();
    if (!currentMenu) return;
    
    const items = [...currentMenu.menuItems];
    const [draggedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    
    this.menu.update(m => ({ ...m!, menuItems: items }));
    this.draggedIndex.set(null);
    this.saveMenu();
  }
  
  saveItem(): void {
    const currentMenu = this.menu();
    if (!currentMenu) return;
    
    const editingItem = this.editingItem();

    const newItem: MenuItemRenderer = {
      id: editingItem?.id || crypto.randomUUID(),
      text: this.newItemText(),
      url: this.newItemUrl() || '',
      parentMenuItemId: this.newItemParentId() || undefined,
      subMenuItems: editingItem?.subMenuItems || []
    };
    
    let updatedMenuItems: MenuItemRenderer[];
    
    if (editingItem) {
      updatedMenuItems = currentMenu.menuItems.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedMenuItems = [...currentMenu.menuItems, newItem];
    }
    
    const updatedMenu: MenuRenderer = {
      id: currentMenu.id,
      type: currentMenu.type,
      menuItems: updatedMenuItems,
    };
    
    this.saveMenu(updatedMenu);
    this.closeModal();
  }
  
  deleteItem(itemId: string): void {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    const currentMenu = this.menu();
    if (!currentMenu) return;
    
    const updatedMenuItems = currentMenu.menuItems.filter(item => item.id !== itemId);
    const updatedMenu: MenuRenderer = {
      id: currentMenu.id,
      type: currentMenu.type,
      menuItems: updatedMenuItems,
    };
    
    this.saveMenu(updatedMenu);
  }

  private saveMenu(menu?: MenuRenderer): void {
    const menuToSave = menu || this.menu();
    if (!menuToSave) return;
    const menuItems: MenuItemRequest[] = this.getMenuItemsForSave(menuToSave.menuItems);
    
    const request: MenuRequest = {
      id: menuToSave.id,
      type: menuToSave.type,
      menuItems: menuItems,
    };
    
    if (menuToSave.id) {
      this.menuService.update(menuToSave.id, request).subscribe({
        next: () => {
          this.menu.set(menuToSave);
        },
        error: (err: any) => {
          console.error('Failed to update menu', err);
        }
      });
    } else {
      this.menuService.create(request).subscribe({
        next: (menu) => {
          this.menu.set(menu);
        },
        error: (err: any) => {
          console.error('Failed to create menu', err);
        }
      });
    }
  }
   getMenuItemsForSave(menuItems: MenuItemRenderer[]): MenuItemRequest[]{
    const result: MenuItemRequest[] = [];
  
    const flatten = (sections: MenuItemRenderer[]) => {
      for (const s of sections) {
        const dto: MenuItemRequest = {
          id: s.id,
          text: s.text,
          url: s.url,
          parentMenuItemId: s.parentMenuItemId,
        };
        result.push(dto);
        if (s.subMenuItems && s.subMenuItems.length > 0) {
          flatten(s.subMenuItems);
        }
      }
    };
  
    // Ejecutamos con tus secciones raíz
    flatten(menuItems);
    
    return result;
    }
  private resetForm(): void {
    this.newItemText.set('');
    this.newItemUrl.set('');
    this.newItemStyle.set('');
    this.newItemParentId.set(undefined);
    this.editingItem.set(null);
  }

  truncateUrl(url: string): string {
    if (!url) return '';
    if (url.length <= 30) return url;
    return url.substring(0, 27) + '...';
  }
  
  toggleExpand(itemId: string): void {
    const current = new Set(this.expandedItems());
    if (current.has(itemId)) {
      current.delete(itemId);
    } else {
      current.add(itemId);
    }
    this.expandedItems.set(current);
  }
  
  addChildItem(parentItem: MenuItemRenderer): void {
    this.openAddModal(parentItem.id);
  }
  
  getRootItems(): MenuItemRenderer[] {
    return this.menu()?.menuItems.filter(item => !item.parentMenuItemId) || [];
  }
  
  getChildren(parentId: string): MenuItemRenderer[] {
    return this.menu()?.menuItems.filter(item => item.parentMenuItemId === parentId) || [];
  }
}
