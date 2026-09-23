import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { CreateRevenueSettlement, RevenueSettlement, SettlementBeneficiary, UpdateRevenueSettlementStatus } from '../models/revenue-settlement';
import { RequestBody } from '../models/rquest';
import ApiService from '../shared/Services/ApiService/api.service';

@Injectable({ providedIn: 'root' })
export class RevenueSettlementService {
  constructor(private api: ApiService) {}
  search(request: RequestBody): Observable<RevenueSettlement[]> { return this.api.query<ApiSearchResponse<RevenueSettlement>>('RevenueSettlements/search', request).pipe(map(response => { if (!response.success) throw new Error(response.message || 'Unable to load settlements'); return response.data ?? []; })); }
  beneficiaries(): Observable<SettlementBeneficiary[]> {
    const request: RequestBody = { filters: [{ propertyName: 'IsActive', value: 'true', operation: 0 }], sort: [{ sortBy: 'Username', sortDirection: 'asc' }], pagination: { getAll: true, pageNumber: 0, pageSize: 0 }, columns: [] };
    return this.api.query<ApiSearchResponse<SettlementBeneficiary>>('Users/search', request).pipe(map(response => { if (!response.success) throw new Error(response.message || 'Unable to load beneficiaries'); return response.data ?? []; }));
  }
  create(body: CreateRevenueSettlement): Observable<RevenueSettlement> { return this.api.post<ApiResponse<RevenueSettlement>>('RevenueSettlements', body, 'Settlement created successfully').pipe(map(response => this.unwrap(response, 'Unable to create settlement'))); }
  updateStatus(id: string, body: UpdateRevenueSettlementStatus): Observable<void> {
    return this.api.put<ApiResponse<RevenueSettlement> | void>(`RevenueSettlements/${id}/status`, id, body, 'Settlement status updated successfully').pipe(
      map(response => {
        if (response && !response.success) throw new Error(response.message || 'Unable to update settlement');
      })
    );
  }
  private unwrap<T>(response: ApiResponse<T>, fallback: string): T { if (!response.success) throw new Error(response.message || fallback); return response.data; }
}
