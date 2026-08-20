export enum MenuType {
  Sidebar = 'Sidebar',
  Footer = 'Footer',
  Header = 'Header',
}
export interface MenuRequest {
  id?: string;
  type: MenuType;
  menuItems: MenuItemRequest[];
}

export interface MenuItemRequest {
  id?: string;
  text: string;
  url?: string;
  order:number;
  parentMenuItemId?: string;
}

export interface MenuRenderer {
  id?: string;
  type: MenuType;
  menuItems: MenuItemRenderer[];
}
export interface MenuItemRenderer {
  id: string;
  text: string;
  url: string;
  parentMenuItemId?: string;
  subMenuItems: MenuItemRenderer[];

  // Helper fields
  toggled: boolean;
}
