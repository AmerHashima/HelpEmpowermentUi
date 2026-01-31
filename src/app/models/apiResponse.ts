// src\app\models\apiResponse.ts
export interface ApiResponse<T> {

  success: boolean,
  message: string,
  data: T,
  errors: string[],
}


export interface ApiSearchResponse<T> {

  success: boolean,
  message: string,
  data: T[];
  totalCount: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}



// export interface PaginatedData<T> {
//   data: T[];
//   totalRecords: number;
//   pageNumber: number;
//   pageSize: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPreviousPage: boolean;
//   metadata?: Record<string, string>;
// }

