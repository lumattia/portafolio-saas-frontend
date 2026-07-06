export enum MenuType {
  Sidebar = 'Sidebar',
  Footer = 'Footer',
}

export interface MenuItem {
  id: string;
  text: string;
  url?: string;
  order: number;
}

export interface MenuItemRequest {
  id?: string;
  text: string;
  url?: string;
}

export interface MenuRequest {
  id?: string;
  type: MenuType;
  menuItems: MenuItemRequest[];
}

export interface MenuDto {
  id?: string;
  type: MenuType;
  menuItems: MenuItem[];
}

export interface MenuSnapshotDto {
  type: MenuType;
  menuItems: any;
}
