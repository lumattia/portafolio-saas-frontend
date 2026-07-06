import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { MenuDto, MenuRequest, MenuItem, MenuType } from '../../../core/models/menu.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-sidebar-menu-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './sidebar-menu-editor.component.html',
  styleUrls: ['./sidebar-menu-editor.component.scss']
})
export class SidebarMenuEditorComponent implements OnInit {
  private readonly menuService = inject(MenuService);
  
  readonly menu = signal<MenuDto | null>(null);
  readonly loading = signal(false);
  readonly showAddModal = signal(false);
  readonly editingItem = signal<MenuItem | null>(null);
  readonly draggedIndex = signal<number | null>(null);
  
  readonly newItemText = signal('');
  readonly newItemUrl = signal('');
  
  ngOnInit(): void {
    this.loadMenu();
  }
  
  private loadMenu(): void {
    this.loading.set(true);
    this.menuService.getMenu(MenuType.Sidebar).subscribe({
      next: (menu: MenuDto | null) => {
        if (menu) {
          this.menu.set(menu);
        } else {
          this.menu.set({ type: MenuType.Sidebar, menuItems: [] });
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load sidebar menu', err);
        this.loading.set(false);
      }
    });
  }
  
  openAddModal(): void {
    this.resetForm();
    this.editingItem.set(null);
    this.showAddModal.set(true);
  }
  
  openEditModal(item: MenuItem): void {
    this.newItemText.set(item.text);
    this.newItemUrl.set(item.url || '');
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
    
    this.menu.update(m => m ? { ...m, menuItems: items } : null);
    this.draggedIndex.set(null);
    this.saveMenu();
  }
  
  saveItem(): void {
    const currentMenu = this.menu();
    if (!currentMenu) return;
    
    const editingItem = this.editingItem();
    let processedUrl = this.newItemUrl()?.trim() || undefined;

    if (processedUrl && (processedUrl.startsWith('http://') || processedUrl.startsWith('https://'))) {
      try {
        const parsedUrl = new URL(processedUrl);
        const currentHost = window.location.host; // Captura subdominios o dominios personalizados

        // Si el dominio coincide con el que está navegando el usuario, extraemos el path relativo
        if (parsedUrl.host === currentHost) {
          processedUrl = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
        }
      } catch (e) {
        console.error('URL no válida, se guardará como string plano:', e);
      }
    }
    const newItem: MenuItem = {
      id: editingItem?.id || crypto.randomUUID(),
      text: this.newItemText(),
      url: processedUrl,
      order: editingItem?.order ?? currentMenu.menuItems.length
    };
    
    let updatedMenuItems: MenuItem[];
    
    if (editingItem) {
      updatedMenuItems = currentMenu.menuItems.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedMenuItems = [...currentMenu.menuItems, newItem];
    }
    
    const updatedMenu: MenuDto = {
      id: currentMenu.id,
      type: currentMenu.type,
      menuItems: updatedMenuItems
    };
    
    this.saveMenu(updatedMenu);
    this.closeModal();
  }
  
  deleteItem(itemId: string): void {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    const currentMenu = this.menu();
    if (!currentMenu) return;
    
    const updatedMenuItems = currentMenu.menuItems.filter(item => item.id !== itemId);
    const updatedMenu: MenuDto = {
      id: currentMenu.id,
      type: currentMenu.type,
      menuItems: updatedMenuItems
    };
    
    this.saveMenu(updatedMenu);
  }
  
  private saveMenu(menu?: MenuDto): void {
    const menuToSave = menu || this.menu();
    if (!menuToSave) return;
    
    const request: MenuRequest = {
      id: menuToSave.id,
      type: menuToSave.type,
      menuItems: menuToSave.menuItems.map(item => ({
        id: item.id,
        text: item.text,
        url: item.url || '',
        order: item.order
      }))
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
        next: () => {
          if(!this.menu()?.id)this.loadMenu()
          else this.menu.set(menuToSave);
        },
        error: (err: any) => {
          console.error('Failed to create menu', err);
        }
      });
    }
  }
  
  private resetForm(): void {
    this.newItemText.set('');
    this.newItemUrl.set('');
    this.editingItem.set(null);
  }
}
