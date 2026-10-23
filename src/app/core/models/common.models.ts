
export interface IdName {
  id: string | number;
  name: string;
  flag?: string;
}

export class PagedParameters {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  isDescending?: boolean;
  totalPages: number;

  constructor(
    pageIndex: number = 1,
    pageSize: number = 5,
    totalPages: number = 1,
    sortBy?: string,
    isDescending?: boolean
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
    this.sortBy = sortBy;
    this.isDescending = isDescending;
  }

  static default(pageSize = 5): PagedParameters {
    return new PagedParameters(1, pageSize, 1);
  }

  fromPagedList<T>(pagedList: PagedList<T>) {
    this.pageIndex = pagedList.pageIndex;
    this.totalPages = pagedList.totalPages;
  }
}
export interface PagedList<T> {
  list: T[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
