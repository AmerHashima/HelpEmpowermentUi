import { computed, effect, Injectable, signal } from '@angular/core';
import { APILiveCourse, LiveCourse } from '../models/liveCourse';
import ApiService from '../shared/Services/ApiService/api.service';
import { Filter, RequestBody } from '../models/rquest';
import { map, Observable } from 'rxjs';
import { ApiWebinar } from '../models/webinar';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class LiveCourseService {
  liveCourses = signal<APILiveCourse[]>([]);
  total = signal<number>(0);
  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  filters = signal<Filter[]>([]);
  mapCoursesToSessions = computed(() => {
    return this.liveCourses().map((c: APILiveCourse) => {
      return {
        date: this.formatDate(c.startDate),
        time: c.startTime,
        title: c.courseName,
        courseName: c.courseRefName
      };
    });
  })
  constructor(private apiService: ApiService) {
    effect(() => {
      const page = this.pageNumber();
      const size = this.pageSize();
      const filters = this.filters();
      this.loadLiveServices(page, size, filters);
    });
  }

  loadLiveServices(page: number, size: number, filters: Filter[]) {
    const requestBody = {
      filters: filters,
      sort: [
        {
          sortBy: "createdAt",
          sortDirection: "desc"
        }],
      pagination: {
        getAll: false,
        pageNumber: page,
        pageSize: size
      },
      columns: []
    }
    this.searchLiveCourses(requestBody).subscribe({
      next: (res) => {
        this.liveCourses.set(res.courses);
        this.total.set(res.total);
      }
    })
  }

  searchLiveCourses(body: RequestBody): Observable<{ courses: APILiveCourse[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APILiveCourse>>('LiveCourses/search', body)
      .pipe(
        map((response: ApiSearchResponse<APILiveCourse>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query live courses';
            throw new Error(msg);
          }
          return {
            courses: response.data ?? [],
            total: response.totalCount ?? 0,
          };
        })
      );
  }

  createLiveCourse(body: LiveCourse): Observable<APILiveCourse> {
    return this.apiService
      .post<ApiResponse<APILiveCourse>>('LiveCourses', body, "liveCourse.register.success")
      .pipe(
        map((response: ApiResponse<APILiveCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create live course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  updateLiveCourse(id: string, body: LiveCourse): Observable<APILiveCourse> {
    const updateBody: LiveCourse = {
      ...body,
      oid: id,
    };

    return this.apiService
      .put<ApiResponse<APILiveCourse>>('LiveCourses', id, updateBody, 'liveCourse.update.success')
      .pipe(
        map((response: ApiResponse<APILiveCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update live course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteLiveCourse(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('LiveCourses', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete live Course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getLiveCourse(id: string): Observable<APILiveCourse> {
    return this.apiService
      .getSingle<ApiResponse<APILiveCourse>>('LiveCourses', id)
      .pipe(
        map((response: ApiResponse<APILiveCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load live course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  //HELPER
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  }
}
