import { Component, inject, signal, OnInit, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../../core/services/menu.service';
import { ModalService } from '../../../../core/services/modal.service';
import { MenuItemRenderer, MenuItemRequest, MenuRenderer, MenuRequest, MenuType } from '../../../../core/models/menu.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-footer-menu-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './menu-editor.component.html',
  styleUrls: ['./menu-editor.component.scss']
})
export class MenuEditorComponent implements OnInit {
    close!: () => void;
    dismiss!: (reason?: any) => void;

    private readonly menuService = inject(MenuService);
    private readonly modalService = inject(ModalService);
    
    menu: MenuRenderer = {} as MenuRenderer;
    originalMenu: MenuRenderer = {} as MenuRenderer;
    readonly loading = signal(false);
    readonly showAddModal = signal(false);
    readonly editingItem = signal<MenuItemRenderer | null>(null);
    readonly draggedIndex = signal<number | null>(null);
    readonly expandedItems = signal<Set<string>>(new Set());
    readonly hasUnsavedChanges = signal(false);
    
    readonly newItemText = signal('');
    readonly newItemUrl = signal('');
    readonly newItemStyle = signal('');
    readonly newItemParentId = signal<string | undefined>(undefined);
    
    private overlayMouseDownOutside = false;

    ngOnInit(): void {
        this.originalMenu = JSON.parse(JSON.stringify(this.menu));
    }
    
    private checkForChanges(): void {
        this.hasUnsavedChanges.set(JSON.stringify(this.menu) !== JSON.stringify(this.originalMenu));
    }
    
    private normalizeUrl(url: string): string {
        if (!url) return '/';
        
        // If it's already an external URL, return as is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            // If it's the current site's full URL, convert to relative path
            const currentOrigin = window.location.origin;
            if (url.startsWith(currentOrigin)) {
                return url.substring(currentOrigin.length);
            }
            return url;
        }
        
        // If it starts with /, it's already absolute
        if (url.startsWith('/')) {
            return url;
        }
        
        // Otherwise, make it absolute
        return '/' + url;
    }
    
    openAddModal(parentId: string | undefined = undefined): void {
      this.resetForm();
      this.newItemParentId.set(parentId);
      this.editingItem.set(null);
      this.showAddModal.set(true);
    }
    
    attemptClose(): void {
      if (this.hasUnsavedChanges()) {
          const modalRef = this.modalService.open(ConfirmModalComponent, {
              title: 'Cambios sin guardar',
              message: 'Tienes cambios sin guardar. ¿Deseas cerrar?'
          });
          modalRef.result.then((res) => {
              if (res.confirmed) {
                  this.close();
              }
          });
      } else {
          this.close();
      }
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
    handleOverlayMouseDown(event: MouseEvent): void {
    // Check if the click is on the overlay (not the modal)
    if (event.target === event.currentTarget) {
      this.overlayMouseDownOutside = true;
    }
  }
  
  handleOverlayMouseUp(event: MouseEvent): void {
    // Reset the flag on mouse up
    if (event.target !== event.currentTarget) {
      this.overlayMouseDownOutside = false;
    }
  }
  
  handleOverlayClick(event: MouseEvent): void {
    // Only close if both mousedown and click happened on the overlay
    if (event.target === event.currentTarget && this.overlayMouseDownOutside) {
      this.closeModal();
    }
    this.overlayMouseDownOutside = false;
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
  
      if (!this.menu) return;
      
      const items = [...this.menu.menuItems];
      const [draggedItem] = items.splice(dragIndex, 1);
      items.splice(dropIndex, 0, draggedItem);
      
      this.menu = { ...this.menu, menuItems: items };
      this.draggedIndex.set(null);
      this.checkForChanges();
    }
    
    saveItem(): void {
      if (!this.menu) return;
      
      const editingItem = this.editingItem();
  
      const newItem: MenuItemRenderer = {
        id: editingItem?.id || crypto.randomUUID(),
        text: this.newItemText(),
        url: this.normalizeUrl(this.newItemUrl() || ''),
        parentMenuItemId: this.newItemParentId() || undefined,
        subMenuItems: editingItem?.subMenuItems || []
      };
      
      let updatedMenuItems: MenuItemRenderer[];
      
      if (editingItem) {
        updatedMenuItems = this.menu.menuItems.map((item: any) => 
          item.id === editingItem.id ? newItem : item
        );
      } else {
        updatedMenuItems = [...this.menu.menuItems, newItem];
      }
      
      this.menu = {
        id: this.menu.id,
        type: this.menu.type,
        menuItems: updatedMenuItems,
      };
      
      this.closeModal();
      this.checkForChanges();
    }
    
    deleteItem(itemId: string): void {      
      if (!this.menu) return;
      
      const updatedMenuItems = this.menu.menuItems.filter((item: any) => item.id !== itemId);
      this.menu = {
        id: this.menu.id,
        type: this.menu.type,
        menuItems: updatedMenuItems,
      };
      
      this.checkForChanges();
    }
  
    saveMenu(): void {
      const menuToSave = this.menu;
      const menuItems: MenuItemRequest[] = this.getMenuItemsForSave(menuToSave.menuItems);
      const request: MenuRequest = {
        id: menuToSave.id,
        type: menuToSave.type,
        menuItems: menuItems,
      };
      if (menuToSave.id) {
        this.menuService.update(menuToSave.id, request).subscribe({
          next: () => {
            this.menu = menuToSave;
            this.close()
          },
          error: (err: any) => {
            console.error('Failed to update menu', err);
          }
        });
      } else {
        this.menuService.create(request).subscribe({
          next: (menu) => {
            this.menu = menu;
            this.close();
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
    return this.menu?.menuItems.filter((item: any) => !item.parentMenuItemId) || [];
  }
  
  getChildren(parentId: string): MenuItemRenderer[] {
    return this.menu?.menuItems.filter((item: any) => item.parentMenuItemId === parentId) || [];
  }
}
