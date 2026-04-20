import { Injectable, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { ApiWebinar, Webinar } from '../models/webinar';
import { RequestBody } from '../models/rquest';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { re } from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class WebinarService {
  webinars=signal<ApiWebinar[]>([]);
  total = signal<number>(0);

  constructor(private apiService:ApiService) {
    const requestBody={
      filters:[],
      sort: [
        {
          sortBy: "createdAt",
          sortDirection: "desc"
        }],
      pagination: {
        getAll: false,
        pageNumber: 0,
        pageSize: 10
      },
      columns:[]
    }
    this.searchWebinars(requestBody).subscribe({
      next: (res) => {this.webinars.set(res.webinars);
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
}
