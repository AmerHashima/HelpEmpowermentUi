// src\app\Services\lookup.service.ts

import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from '../shared/Services/ApiService/api.service';
import { ApiLookup, LookupDetail } from '../models/lookup';
import { ApiResponse } from '../models/apiResponse';

export const LOOKUP_CODES = {
  COURSE_LEVEL: 'COURSE_LEVEL',
  COURSE_CATEGORY: 'COURSE_CATEGORY',
  QUESTION_TYPE: 'QUESTION_TYPE',
  SERVICE_TYPE: 'SERVICE_TYPE',
  WEBINAR_FORMAT: 'WebinarFormat',
  TIME_ZONE: "TimeZone",
  USER_ROLE:"USER_ROLE",
  announcement:"announcement"
} as const;

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private apiService: ApiService) { }

  // getLookUpByCode(code: string): Observable<ApiLookup> {
  getLookUpByCode(code: string): Observable<LookupDetail[]> {


    return this.apiService
      // .getSingle<ApiResponse<ApiLookup>>('AppLookup', code, { includeDetails: true }
      .getSingle<ApiResponse<LookupDetail[]>>('AppLookups/details/header-code', code
      )
      .pipe(
        map((response: ApiResponse<LookupDetail[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load user';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  ///
  createLookupDetail(body: any): Observable<LookupDetail> {
    return this.apiService
      .post<ApiResponse<LookupDetail>>('AppLookups/details', body, "lookup.add.success")
      .pipe(
        map((response: ApiResponse<LookupDetail>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteLookUpDetail(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('AppLookups/details', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getLookupDetail(id: string): Observable<LookupDetail> {
      return this.apiService
        .getSingle<ApiResponse<LookupDetail>>('AppLookups/details', id)
        .pipe(
          map((response: ApiResponse<LookupDetail>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to load';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

  updateLookupDetail(id: string, body: any): Observable<LookupDetail> {
    const updateBody: LookupDetail = {
          ...body,
          oid: id,
        };

        return this.apiService
          .put<ApiResponse<LookupDetail>>('AppLookups/details', id, updateBody, 'update.success')
          .pipe(
            map((response: ApiResponse<LookupDetail>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to update';
                throw new Error(msg);
              }
              // this.updatedLoggedStudent(response.data);
              return response.data;
            })
          );
      }
  // getCourseLevel() {
  //   return this.getLookUpByCode(LOOKUP_CODES.COURSE_LEVEL);
  // }
  // getCourseCategory() {
  //   return this.getLookUpByCode(LOOKUP_CODES.COURSE_CATEGORY);
  // }
  // getQuestionType() {
  //   return this.getLookUpByCode(LOOKUP_CODES.QUESTION_TYPE);
  // }
  getWebinarFormat() {
    return this.getLookUpByCode(LOOKUP_CODES.WEBINAR_FORMAT);
  }

  getTimeZones() {
    return this.getLookUpByCode(LOOKUP_CODES.TIME_ZONE);
  }

  getServiceType() {
    return this.getLookUpByCode(LOOKUP_CODES.SERVICE_TYPE);
  }


  getUserRoles() {
    return this.getLookUpByCode(LOOKUP_CODES.USER_ROLE);
  }

  getAnnouncements(){
    return this.getLookUpByCode(LOOKUP_CODES.announcement);

  }

}
