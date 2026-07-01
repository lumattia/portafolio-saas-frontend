
export interface IdName {
  id: string | number;
  name: string;
  flag?: string; 
}

export interface PagedParameters {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  isDescending: boolean;
}

export interface PagedList<T> {
  list: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
