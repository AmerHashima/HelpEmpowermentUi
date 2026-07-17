import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APICourseReservation, CourseReservation, UpdateCourseReservation } from '../Interface/course-reservation';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { RequestBody } from '../models/rquest';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private apiService:ApiService) { }

  CreateReservation(body: CourseReservation): Observable<APICourseReservation> {
      return this.apiService
        .post<ApiResponse<APICourseReservation>>('StudentCourseReservations', body, "course.enroll.success")
        .pipe(
          map((response: ApiResponse<APICourseReservation>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to enroll course';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

  getCourseReservation(id: string): Observable<APICourseReservation> {
        return this.apiService
          .getSingle<ApiResponse<APICourseReservation>>('StudentCourseReservations', id)
          .pipe(
            map((response: ApiResponse<APICourseReservation>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to load student';
                throw new Error(msg);
              }
              return response.data;
            })
          );
      }

  getCourseReservationByStudentCourseId(id: string): Observable<APICourseReservation[]> {
    return this.apiService
      .getSingle<ApiResponse<APICourseReservation[]>>('StudentCourseReservations/by-enrollment', id)
      .pipe(
        map((response: ApiResponse<APICourseReservation[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load course reservations';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  deleteCourseReservation(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('StudentCourseReservations', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete course reservation';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  updateCourseReservation(id: string, body: UpdateCourseReservation): Observable<APICourseReservation> {
    const updateBody: UpdateCourseReservation = {
        ...body,
        oid: id,
      };

      return this.apiService
        .put<ApiResponse<APICourseReservation>>('StudentCourseReservations', id, updateBody, 'course.update.success')
        .pipe(
          map((response: ApiResponse<APICourseReservation>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to update course reservation';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }


  searchCourseReservations(body: RequestBody): Observable<{ reservations: APICourseReservation[]; total: number }> {
        return this.apiService
          .query<ApiSearchResponse<APICourseReservation>>('StudentCourseReservations/search', body)
          .pipe(
            map((response: ApiSearchResponse<APICourseReservation>) => {
              if (!response.success) {
                const msg = response.message || 'API failed to query course reservations';
                throw new Error(msg);
              }
              return {
                reservations: response.data ?? [],
                total: response.totalCount ?? 0,
              };
            })
          );
      }
}
