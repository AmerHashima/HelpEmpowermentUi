import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APICourseReservation, CourseReservation } from '../Interface/course-reservation';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';

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
}
