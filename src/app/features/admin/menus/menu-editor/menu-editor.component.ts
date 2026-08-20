import { Component, inject, signal, computed, OnInit, model, input, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../../core/services/menu.service';
import { ModalService } from '../../../../core/services/modal.service';
import { MenuItemRenderer, MenuItemRequest, MenuRenderer, MenuRequest, MenuType } from '../../../../core/models/menu.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';

@Component({
  selector: 'app-menu-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent, TextInputComponent],
  templateUrl: './menu-editor.component.html',
  styleUrls: ['./menu-editor.component.scss'],
})
export class MenuEditorComponent {
    close!: () => void;
    dismiss!: (reason?: any) => void;

    private readonly menuService = inject(MenuService);
    private readonly modalService = inject(ModalService);
    menu = input.required<MenuRenderer>();
    readonly loading = signal(false);
    readonly editingItem = signal<MenuItemRenderer | null>(null);
    readonly draggedIndex = signal<number | null>(null);
    readonly draggedParent = signal<MenuItemRenderer | null>(null);
    readonly hasUnsavedChanges = signal(false);

    readonly newItemText = signal('');
    readonly newItemUrl = signal('');
    readonly newItemStyle = signal('');
    readonly parentItem = signal<MenuItemRenderer | null>(null);

    @ViewChild('itemModalTemplate') itemModalTemplate!: TemplateRef<any>;
    private itemModalRef: any;

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

    openAddModal(parentItem: MenuItemRenderer | null = null): void {
      this.resetForm();
      this.parentItem.set(parentItem);
      this.editingItem.set(null);
      this.itemModalRef = this.modalService.open(this.itemModalTemplate);
    }

    attemptClose(): void {
      if (this.hasUnsavedChanges()) {
          const modalRef = this.modalService.open(ConfirmModalComponent);
          modalRef.componentInstance.title = 'Cambios sin guardar';
          modalRef.componentInstance.message = 'Tienes cambios sin guardar. ¿Deseas cerrar?';
          modalRef.result.then((res) => {
              if (res.confirmed) {
                  this.close();
              }
          });
      } else {
          this.close();
      }
    }

    openEditModal(parentItem: MenuItemRenderer | null = null, item: MenuItemRenderer): void {
      this.newItemText.set(item.text);
      this.newItemUrl.set(item.url || '');
      this.parentItem.set(parentItem);
      this.editingItem.set(item);
      this.itemModalRef = this.modalService.open(this.itemModalTemplate);
    }

    closeModal(): void {
      if (this.itemModalRef) {
        this.itemModalRef.close();
        this.itemModalRef = null;
      }
      this.resetForm();
    }

    onDragStart(event: DragEvent, index: number, parent: MenuItemRenderer | null): void {
      this.draggedIndex.set(index);
      this.draggedParent.set(parent);
      event.dataTransfer?.setData('text/plain', JSON.stringify({ index, parentId: parent?.id }));
    }

    onDragOver(event: DragEvent): void {
      event.preventDefault();
    }

    onDrop(event: DragEvent, dropIndex: number, dropParent: MenuItemRenderer | null): void {
      event.preventDefault();

      const dragIndex = this.draggedIndex();
      const dragParent = this.draggedParent();

      if (dragIndex === null || dragIndex === dropIndex || dragParent !== dropParent || !this.menu) return;

      const getArray = (parent: MenuItemRenderer | null) =>
        parent ? parent.subMenuItems : this.menu().menuItems;

      const sourceArray = getArray(dragParent);
      const destArray = getArray(dropParent);

      if (!sourceArray || !destArray) return;

      const [draggedItem] = sourceArray.splice(dragIndex, 1);
      destArray.splice(dropIndex, 0, draggedItem);

      this.draggedIndex.set(null);
      this.draggedParent.set(null);
      this.hasUnsavedChanges.set(true);
    }

    saveItem(): void {
      if (!this.menu) return;

      const editingItem = this.editingItem();

      const newItem: MenuItemRenderer = {
        id: editingItem?.id || crypto.randomUUID(),
        text: this.newItemText(),
        url: this.normalizeUrl(this.newItemUrl() || ''),
        subMenuItems: editingItem?.subMenuItems || [],
        toggled: false
      };
      if (editingItem) {
        const parent = this.parentItem();
         if (parent) {
          parent.subMenuItems = parent.subMenuItems.map((item: any) =>
            item.id === editingItem.id ? newItem : item
          );
        } else {
          this.menu().menuItems = this.menu().menuItems.map((item: any) =>
            item.id === editingItem.id ? newItem : item
          );
        }
      } else {
        // Add new item
        const parent = this.parentItem();
        if (parent) {
          newItem.parentMenuItemId = this.parentItem()?.id || undefined
          parent.subMenuItems = [...(parent.subMenuItems || []), newItem];
        } else {
          // Add to root level
          this.menu().menuItems = [...this.menu().menuItems, newItem];
        }
      }

      this.closeModal();
      this.hasUnsavedChanges.set(true);
    }

    deleteItem(itemId: string): void {
      if (!this.menu) return;

      const updatedMenuItems = this.menu().menuItems.filter((item: any) => item.id !== itemId);
      this.menu().menuItems = updatedMenuItems

      this.hasUnsavedChanges.set(true);
    }

    saveMenu(): void {
      const menuToSave = this.menu;
      const menuItems: MenuItemRequest[] = this.getMenuItemsForSave(menuToSave().menuItems);
      const request: MenuRequest = {
        id: menuToSave().id,
        type: menuToSave().type,
        menuItems: menuItems,
      };
      if (menuToSave().id) {
        this.menuService.update(menuToSave().id!, request).subscribe({
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
            this.menu().id = menu.id;
            this.menu().menuItems = menu.menuItems;
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
        let currentIndex = 0;
      const flatten = (sections: MenuItemRenderer[]) => {
        for (const s of sections) {
          const dto: MenuItemRequest = {
            id: s.id,
            text: s.text,
            url: s.url,
            parentMenuItemId: s.parentMenuItemId,
            order: currentIndex++
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
      this.parentItem.set(null);
      this.editingItem.set(null);
    }

  truncateUrl(url: string): string {
    if (!url) return '';
    if (url.length <= 30) return url;
    return url.substring(0, 27) + '...';
  }

  addChildItem(parentItem: MenuItemRenderer): void {
      this.openAddModal(parentItem);
  }
}
