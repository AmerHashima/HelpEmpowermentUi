// src\app\Services\student-service.service.ts
import { computed, effect, Injectable, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map, Observable } from 'rxjs';
import { APIStudent, Student } from '../models/student';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APIStudentExamResponse, startStudentExam } from '../models/certification';
import { RequestBody } from '../models/rquest';
import { APIStudentCourse, StudentCourse, updateStudentCourse } from '../models/student-course';
import { AuthService } from './auth.service';
import { Shared } from '../shared/Services/shared/shared';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  enrolledCourses=signal<APIStudentCourse[]>([]);

  currentCourse = computed(() => {
    const certification = this.shared.currentCertificate();
    return this.enrolledCourses()
      .find(c => c.courseName.toLowerCase() === certification?.toLowerCase()) ?? null;
  });

  isExamSimulatorEnrolled = computed(() =>
    true
    // !!this.currentCourse()?.examSimulationReserv
  );

  isRecordedCoursesEnrolled = computed(() =>
    !!this.currentCourse()?.recordedCourseReserv
  );

  isLiveCourseEnrolled = computed(() =>
    !!this.currentCourse()?.liveCourseReserv
  );
  constructor(private apiService: ApiService,private auth:AuthService,private shared:Shared) { 
    effect(()=>{
     const studentId =this.auth.loggedStudent()?.userId
     if(!studentId) return;
      this.getAllStudentEnrolledCourses(studentId).subscribe({
        next: (courses) => { this.enrolledCourses.set(courses) }
      });
    })

  
  }

  //student
  searchStudents(body: RequestBody): Observable<{ students: APIStudent[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIStudent>>('Students/with-courses', body)
      .pipe(
        map((response: ApiSearchResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query students';
            throw new Error(msg);
          }
          return {
            students: response.data ?? [],
            total: response.totalCount ?? 0,
          };
        })
      );
  }

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
      .post<ApiResponse<APIStudent>>('Students', body, "Student has been registerted Successfully")
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
    const updateBody: Student = {
      ...body,
      oid: id,
    };

    return this.apiService
      .put<ApiResponse<APIStudent>>('Students', id, updateBody, 'User info has been updated successfully')
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

  getStudentReservedCourses(studentId: string): Observable<APIStudentCourse[]> {
    return this.apiService
      .get<ApiResponse<APIStudentCourse[]>>(`StudentCourses/student/${studentId}`)
      .pipe(
        map((response: ApiResponse<APIStudentCourse[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student courses';
            throw new Error(msg);
          }
          return response.data ?? [];
        })
      );
  }

  // startExam(body: startStudentExam): Observable<APIStudentExamResponse> {
  //   return this.apiService
  //     .post<ApiResponse<APIStudentExamResponse>>('StudnetExams/start', body, "Exam has been started!")
  //     .pipe(
  //       map((response: ApiResponse<APIStudentExamResponse>) => {
  //         if (!response.success) {
  //           const msg = response.errors?.join(', ') || response.message || 'API failed to start exam';
  //           throw new Error(msg);
  //         }
  //         return response.data;
  //       })
  //     );
  // }

  //student Courses
  enrollCourse(body: StudentCourse): Observable<APIStudentCourse> {
    return this.apiService
      .post<ApiResponse<APIStudentCourse>>('StudentCourses/enroll', body, "Student has been enrolled Successfully")
      .pipe(
        map((response: ApiResponse<APIStudentCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to enroll course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateStudentCourseData(id: string, body: updateStudentCourse): Observable<APIStudentCourse> {
    const updateBody: updateStudentCourse = {
      ...body,
      oid: id,
    };

    return this.apiService
      .put<ApiResponse<APIStudentCourse>>('StudentCourses', id, updateBody, 'Course info has been updated successfully')
      .pipe(
        map((response: ApiResponse<APIStudentCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteStudentCourse(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('StudentCourses', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete student Course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  searchStudentCourses(body: RequestBody): Observable<{ courses: APIStudentCourse[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIStudentCourse>>('StudentCourses/search', body)
      .pipe(
        map((response: ApiSearchResponse<APIStudentCourse>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query student course';
            throw new Error(msg);
          }
          return {
            courses: response.data ?? [],
            total: response.totalCount ?? 0,
          };
        })
      );
  }

  getStudentCourseByCourseId(id: string): Observable<APIStudentCourse> {
    return this.apiService
      .getSingle<ApiResponse<APIStudentCourse>>('StudentCourses', id)
      .pipe(
        map((response: ApiResponse<APIStudentCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student course';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  getAllStudentEnrolledCourses(studentId:string): Observable<APIStudentCourse[]> {
    return this.apiService
      .getSingle<ApiResponse<APIStudentCourse[]>>('StudentCourses/student', studentId)
      .pipe(
        map((response: ApiResponse<APIStudentCourse[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student courses';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getcourseEnrolledStudents(courseId: string): Observable<APIStudentCourse[]> {
    return this.apiService
      .getSingle<ApiResponse<APIStudentCourse[]>>('StudentCourses/course', courseId)
      .pipe(
        map((response: ApiResponse<APIStudentCourse[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student courses';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  checkStudentEnrolledInCourse(studentId:string,courseId: string): Observable<boolean> {
    return this.apiService
      .getSingle<ApiResponse<boolean>>(`StudentCourses/check/${studentId}`, courseId)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to check ';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateStudentCoursePayment(id: string, body: {
    paymentStatusLookupId:string,
    transactionId:string
  }): Observable<APIStudentCourse> {
   

    return this.apiService
      .put<ApiResponse<APIStudentCourse>>('StudentCourses', id, body, 'payment info has been updated successfully','payment')
      .pipe(
        map((response: ApiResponse<APIStudentCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update payment info';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateStudentProgress(id: string, body: {
    completedLessons: string,
    totalLessons: string
  }): Observable<APIStudentCourse> {


    return this.apiService
      .put<ApiResponse<APIStudentCourse>>('StudentCourses', id, body, 'progress info has been updated successfully', 'progress')
      .pipe(
        map((response: ApiResponse<APIStudentCourse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update progress info';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

}
