// src\app\models\rquest.ts
export interface Filter {
  propertyName: string;
  value: string;
  operation: number;
}

export interface Sort {
  sortBy: string;
  sortDirection: string;
}

export interface Pagination {
  getAll: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface RequestBody {
  filters: Filter[];
  sort: Sort[];
  pagination: Pagination;
  columns: string[];
}

// export interface RequestWrapper {
//   request: RequestBody;
// }
