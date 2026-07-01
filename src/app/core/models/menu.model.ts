export interface MenuItem {
  id: string;
  text: string;
  pageId?: string;
  pageSlug: string;
  externalUrl?: string;
  isExternal: boolean;
  order: number;
}

export interface MenuRequest {
  id?: string;
  text: string;
  pageSlug: string;
  externalUrl?: string;
  isExternal: boolean;
  order: number;
}
