import { computed, effect, Injectable, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { ApiWebinar, Webinar } from '../models/webinar';
import { Filter, RequestBody } from '../models/rquest';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { re } from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class WebinarService {
  webinars=signal<ApiWebinar[]>([]);
  total = signal<number>(0);
  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  filters=signal<Filter[]>([])
  mapWebinarsToSessions =computed(()=> {
    return this.webinars().map(w => {
      const start = new Date(w.webinarStartTime);
      const end = new Date(w.webinarEndTime);

      return {
        date: this.formatDate(w.webinarDate),
        time: this.formatDuration(start, end),
        title: w.webinarName
      };
    });
  })


  constructor(private apiService: ApiService) {
    effect(() => {
      const page = this.pageNumber();
      const size = this.pageSize();
      const filters=this.filters();
      this.loadWebinars(page, size, filters);
    });
  }

  loadWebinars(page: number, size: number, filters:Filter[]) {
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
    this.searchWebinars(requestBody).subscribe({
      next: (res) => {
        this.webinars.set(res.webinars);
        this.total.set(res.total);
      }
    })
  }





  searchWebinars(body: RequestBody): Observable<{ webinars: ApiWebinar[]; total: number }> {
        return this.apiService
          .query<ApiSearchResponse<ApiWebinar>>('LiveWebinars/search', body)
          .pipe(
            map((response: ApiSearchResponse<ApiWebinar>) => {
              if (!response.success) {
                const msg = response.message || 'API failed to query webinars';
                throw new Error(msg);
              }
              return {
                webinars: response.data ?? [],
                total: response.totalCount ?? 0,
              };
            })
          );
      }

  createWebinar(body: Webinar): Observable<ApiWebinar> {
        return this.apiService
          .post<ApiResponse<ApiWebinar>>('LiveWebinars', body, "webinar.register.success")
          .pipe(
            map((response: ApiResponse<ApiWebinar>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to create webinar';
                throw new Error(msg);
              }
              return response.data;
            })
          );
      }
  updateWebinar(id: string, body: Webinar): Observable<ApiWebinar> {
    const updateBody: Webinar = {
          ...body,
          oid: id,
        };

        return this.apiService
          .put<ApiResponse<ApiWebinar>>('LiveWebinars', id, updateBody, 'webinar.update.success')
          .pipe(
            map((response: ApiResponse<ApiWebinar>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to update article';
                throw new Error(msg);
              }
              return response.data;
            })
          );
      }

      deleteWebinar(id: string): Observable<boolean> {
        return this.apiService
          .delete<ApiResponse<boolean>>('LiveWebinars', id)
          .pipe(
            map((response: ApiResponse<boolean>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to delete webinar';
                throw new Error(msg);
              }
              return response.data;
            })
          );
      }

  getWebinar(id: string): Observable<ApiWebinar> {
        return this.apiService
          .getSingle<ApiResponse<ApiWebinar>>('LiveWebinars', id)
          .pipe(
            map((response: ApiResponse<ApiWebinar>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to load webinar';
                throw new Error(msg);
              }
              return response.data;
            })
          );
      }
      //helpers
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  }
  formatDuration(start: Date, end: Date): string {
    const startStr = start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const endStr = end.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${startStr} - ${endStr}`;
  }
}
