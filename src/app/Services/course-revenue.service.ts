import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { CourseRevenueReport, CourseRevenueShare, CourseRevenueSummary, SaveCourseRevenueShare } from '../models/course-revenue';
import { RequestBody } from '../models/rquest';
import ApiService from '../shared/Services/ApiService/api.service';

@Injectable({ providedIn: 'root' })
export class CourseRevenueService {
  constructor(private api: ApiService) {}

  search(courseId: string): Observable<CourseRevenueShare[]> {
    const request: RequestBody = {
      filters: [],
      sort: [{ sortBy: 'CreatedAt', sortDirection: 'desc' }],
      pagination: { getAll: true, pageNumber: 1, pageSize: 50 },
      columns: []
    };
    return this.api.query<ApiSearchResponse<CourseRevenueShare>>(`CourseRevenue/${courseId}/search`, request).pipe(
      map(response => {
        if (!response.success) throw new Error(response.message || 'Unable to load revenue shares');
        return response.data ?? [];
      })
    );
  }

  searchReport(request: RequestBody): Observable<ApiSearchResponse<CourseRevenueReport>> {
    return this.api.query<ApiSearchResponse<CourseRevenueReport>>('CourseRevenue/search', request);
  }

  summary(courseId: string): Observable<CourseRevenueSummary> {
    return this.api.get<ApiResponse<CourseRevenueSummary>>(`CourseRevenue/${courseId}/summary`).pipe(
      map(response => this.unwrap(response, 'Unable to load revenue summary'))
    );
  }

  create(courseId: string, body: SaveCourseRevenueShare): Observable<CourseRevenueShare> {
    return this.api.post<ApiResponse<CourseRevenueShare>>(`CourseRevenue/${courseId}`, body, 'Revenue share created successfully').pipe(
      map(response => this.unwrap(response, 'Unable to create revenue share'))
    );
  }

  update(courseId: string, id: string, body: SaveCourseRevenueShare): Observable<CourseRevenueShare> {
    return this.api.put<ApiResponse<CourseRevenueShare>>(`CourseRevenue/${courseId}/${id}`, id, body, 'Revenue share updated successfully').pipe(
      map(response => this.unwrap(response, 'Unable to update revenue share'))
    );
  }

  delete(courseId: string, id: string): Observable<boolean> {
    return this.api.delete<ApiResponse<boolean>>(`CourseRevenue/${courseId}`, id, 'Revenue share deleted successfully').pipe(
      map(response => this.unwrap(response, 'Unable to delete revenue share'))
    );
  }

  private unwrap<T>(response: ApiResponse<T>, fallback: string): T {
    if (!response.success) throw new Error(response.message || fallback);
    return response.data;
  }
}
