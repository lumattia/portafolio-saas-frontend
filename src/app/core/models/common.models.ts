
export interface IdName {
  id: string | number;
  name: string;
  flag?: string;
}

export interface PagedParameters {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  isDescending?: boolean;
}

export interface PagedList<T> {
  list: T[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
export function hasPrevious<T>(page?: PagedList<T> | null): boolean {
  return (page?.pageIndex ?? 0) > 0;
}

export function hasNext<T>(page?: PagedList<T> | null): boolean {
  return (page?.pageIndex ?? 0) < (page?.totalPages ?? 0) - 1;
}
export interface FileInfoResponse {
  url: string;
  fileName: string;
  size: number;
}
