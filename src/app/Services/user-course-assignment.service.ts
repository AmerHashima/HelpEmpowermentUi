import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { SaveUserCourseAssignment, UserCourseAssignment } from '../models/user-course-assignment';
import { RequestBody } from '../models/rquest';
import ApiService from '../shared/Services/ApiService/api.service';

@Injectable({ providedIn: 'root' })
export class UserCourseAssignmentService {
  constructor(private api: ApiService) {}

  getForUser(userId: string): Observable<UserCourseAssignment[]> {
    const request: RequestBody = {
      filters: [{ propertyName: 'UserId', value: userId, operation: 0 }],
      sort: [{ sortBy: 'Course.CourseName', sortDirection: 'asc' }],
      pagination: { getAll: true, pageNumber: 1, pageSize: 50 },
      columns: []
    };

    return this.api
      .query<ApiSearchResponse<UserCourseAssignment>>('UserCourseAssignments/search', request)
      .pipe(map(response => this.unwrapSearch(response, 'Unable to load course assignments')));
  }

  search(request: RequestBody): Observable<ApiSearchResponse<UserCourseAssignment>> {
    return this.api.query<ApiSearchResponse<UserCourseAssignment>>('UserCourseAssignments/search', request);
  }

  create(body: SaveUserCourseAssignment): Observable<UserCourseAssignment> {
    return this.api
      .post<ApiResponse<UserCourseAssignment>>('UserCourseAssignments', body, 'Course assignment created successfully')
      .pipe(map(response => this.unwrap(response, 'Unable to create course assignment')));
  }

  update(id: string, body: SaveUserCourseAssignment): Observable<UserCourseAssignment> {
    return this.api
      .put<ApiResponse<UserCourseAssignment>>(`UserCourseAssignments/${id}`, id, body, 'Course assignment updated successfully')
      .pipe(map(response => this.unwrap(response, 'Unable to update course assignment')));
  }

  delete(id: string): Observable<boolean> {
    return this.api
      .delete<ApiResponse<boolean>>('UserCourseAssignments', id, 'Course assignment deleted successfully')
      .pipe(map(response => this.unwrap(response, 'Unable to delete course assignment')));
  }

  private unwrap<T>(response: ApiResponse<T>, fallback: string): T {
    if (!response.success) throw new Error(response.message || fallback);
    return response.data;
  }

  private unwrapSearch<T>(response: ApiSearchResponse<T>, fallback: string): T[] {
    if (!response.success) throw new Error(response.message || fallback);
    return response.data ?? [];
  }
}
