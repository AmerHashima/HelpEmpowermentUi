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
  WEBINAR_FORMAT: 'WebinarFormat',
  TIME_ZONE:"TimeZone"
} as const;

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private apiService: ApiService) { }

  // getLookUpByCode(code: string): Observable<ApiLookup> {
  getLookUpByCode(code: string): Observable<LookupDetail[] > {


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


}
