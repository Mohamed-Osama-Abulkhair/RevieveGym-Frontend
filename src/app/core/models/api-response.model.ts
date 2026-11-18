export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  result?: T;
  total?: number;
  totalCount?: number;
  count?: number;
  metadata?: {
    totalPages?: number;
    numberOfPages?: number;
    currentPage?: number;
    limit?: number;
    nextPage?: number | null;
    prevPage?: number | null;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  fields?: string;
  [key: string]: any;
}
