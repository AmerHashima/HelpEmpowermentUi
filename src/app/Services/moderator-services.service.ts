import { effect, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiSearchResponse, ApiResponse } from '../models/apiResponse';
import { Filter, RequestBody } from '../models/rquest';
import ApiService from '../shared/Services/ApiService/api.service';

export interface APIUser {
  oid: string;
  username: string;
  nameEn: string;
  nameAr: string;
  email: string;
  mobile: string;
  isActive: boolean;
  roleLookupId?: string;
  roleName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {
  moderators = signal<APIUser[]>([]);
  total = signal<number>(0);
  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  filters = signal<Filter[]>([])
  constructor(private apiService: ApiService) {
    effect(() => {
      const page = this.pageNumber();
      const size = this.pageSize();
      const filters = this.filters();
      this.loadModerators(page, size, filters);
    });
  }

  loadModerators(page: number, size: number, filters: Filter[]) {
    const requestBody: RequestBody = {
      filters,
      sort: [],
      pagination: {
        getAll: false,
        pageNumber: page,
        pageSize: size
      },
      columns: []
    };

    this.searchModerators(requestBody).subscribe({
      next: (res) => {
        this.moderators.set(res.moderators);
        this.total.set(res.total);
      },
      error: (err) => {
        console.error('SUBSCRIPTION ERROR:', err);
      }
    });
  }

  searchModerators(body: RequestBody): Observable<{ moderators: APIUser[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIUser>>('Users/search', body)
      .pipe(
        map((response: ApiSearchResponse<APIUser>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query moderators';
            throw new Error(msg);
          }
          return {
            moderators: response.data ?? [],
            total: response.totalCount ?? 0,
          };
        })
      );
  }

  deleteModerator(oid: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('Users', oid)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete moderator';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  reloadModerators(pageNumber: number = 0) {
    this.loadModerators(pageNumber, this.pageSize(), this.filters());
  }
}
