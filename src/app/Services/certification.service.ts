// src\app\Services\certification.service.ts
import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APICertification, Certification } from '../models/certification';
import { RequestBody } from '../models/rquest';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  constructor(private apiService: ApiService) { }


  getCertifications(): Observable<APICertification[]> {
    return this.apiService.get<ApiResponse<APICertification[]>>('Courses').pipe(
      map((response: ApiResponse<APICertification[]>) => {
        if (!response.success) {
          throw new Error(response.message || 'API failed to load certifications');
        }
        return response.data;
      })
    );
  }

  createCertification(body: Certification): Observable<APICertification> {
    return this.apiService
      .post<ApiResponse<APICertification>>('Courses', body)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getCertification(id: string): Observable<APICertification> {
    return this.apiService
      .getSingle<ApiResponse<APICertification>>('Courses', id)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateCertification(id: string, body: Certification): Observable<APICertification> {
    return this.apiService
      .put<ApiResponse<APICertification>>('Courses', id, body)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteCertification(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('Courses', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  search(body: RequestBody): Observable<{ certifications: APICertification[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APICertification>>('Courses/search', body)
      .pipe(
        map((response: ApiSearchResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query';
            throw new Error(msg);
          }
          return {
            certifications: response.data ?? [],
            total: response.totalPages ?? 0,
          };
        })
      );
  }
}
