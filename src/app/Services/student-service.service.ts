import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map, Observable } from 'rxjs';
import { APIStudent, Student } from '../models/student';
import { ApiResponse } from '../models/apiResponse';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private apiService:ApiService) { }

    getStudents(): Observable<APIStudent[]> {
      return this.apiService.get<ApiResponse<APIStudent[]>>('Students').pipe(
        map((response: ApiResponse<APIStudent[]>) => {
          if (!response.success) {
            throw new Error(response.message || 'API failed to load students');
          }
          return response.data;
        })
      );
    }

     createStudent(body: Student): Observable<APIStudent> {
        return this.apiService
          .post<ApiResponse<APIStudent>>('Studnets', body,"Student has been registerted Successfully")
          .pipe(
            map((response: ApiResponse<APIStudent>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to create student';
                throw new Error(msg);
              }
              return response.data;
            })
          );
      }
  updateStudent(id: string, body: Student): Observable<APIStudent> {
    return this.apiService
      .put<ApiResponse<APIStudent>>('Students', id, body, 'User info has been updated successfully')
      .pipe(
        map((response: ApiResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update student';
            throw new Error(msg);
          }
          // this.updatedLoggedStudent(response.data);
          return response.data;
        })
      );
  }

  deleteStudent(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('Students', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete student';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

   getStudent(id: string): Observable<APIStudent> {
      return this.apiService
        .getSingle<ApiResponse<APIStudent>>('Students', id)
        .pipe(
          map((response: ApiResponse<APIStudent>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to load student';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

}
