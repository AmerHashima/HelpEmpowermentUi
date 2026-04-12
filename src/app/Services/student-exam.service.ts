// src\app\Services\student-exam.service.ts

import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APIExamSummary, APIStudentExamResponse, choiceQuestionExamSubmit, ExamSummary, matchingQuestionExamSubmit, startStudentExam, submitStudentExam } from '../models/certification';
import { RequestBody } from '../models/rquest';
import { AuthService } from './auth.service';
import { Shared } from '../shared/Services/shared/shared';
import { clearedExamStatusOid, createdUpdatedOID } from '../data/lookUPS';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private auth = inject(AuthService);
  private shared = inject(Shared);
  examIdsToDelete = this.auth.examIdsToDelete;
  // reports = signal<APIStudentExamResponse[]>([]);
  reports = signal<APIStudentExamResponse[]>([]);

  latestReport = signal<APIExamSummary | null>(null);
  private loadedExamId = signal<string | null>(null);
  // successRate = computed(() => {
  //   const reports = this.reports();

  //   if (!reports.length) return 0;

  //   const total = reports.reduce((sum, r) => {
  //     if (!r.totalScore) return sum;
  //     return sum + (r.obtainedScore / r.totalScore) * 100;
  //   }, 0);

  //   return Math.round(total / reports.length);
  // });
  constructor(private apiService: ApiService) {
    // effect(() => {
    //   const studentId = this.auth.loggedStudent()?.userId;

    //   if (!studentId) return;
    //   this.loadReports(studentId);

    // });

    effect(() => {
      const _ = this.shared.currentExamId();
      this.latestReport.set(null);
    });
    effect(() => {
      const token = this.auth.studentToken();

      if (!token) {
        const ids = untracked(() => this.examIdsToDelete());

        if (!ids.length) return;

        ids.forEach(id => {
          this.deleteStudentExam(id).subscribe({
            error: err => console.error('Failed to delete exam', id, err)
          });
        });

        // clear ids so the effect won't repeat
        this.examIdsToDelete.set([]);
      }
    });

  }

  // loadReports(studentId: string) {
  //   this.getStudentExamsByStudentId(studentId)
  //     .pipe(
  //       switchMap((reports: any[]) => {
  //         const requests = reports.map(report =>
  //           this.getStudentExamWithQuestions(report.oid).pipe(
  //             map((examDetails) => {
  //               const summary = this.mapStatusSummary(examDetails.statusSummary);

  //               return {
  //                 ...report,
  //                 summary
  //               };
  //             })
  //           )
  //         );

  //         return forkJoin(requests);
  //       })
  //     )
  //     .subscribe((finalReports) => {
  //       this.reports.set(finalReports);
  //     });
  // }

  loadReports(studentId: string) {
    const examId = this.shared.currentExamId();
    if(!examId) return;
    if (this.loadedExamId() === examId) return;

    const body:RequestBody = {
        filters: [
          {
            propertyName: 'studentOid',
            value: studentId,
            operation: 0
          },
          {
            propertyName: 'coursesMasterExamOid',
            value:examId ,
            operation: 0
          }
        ],
        sort: [],
        pagination: {
          getAll: true,
          pageNumber: 0,
          pageSize: 0
        },
        columns: []

    };
    this.searchStudentExam(body)
        .pipe(
          switchMap((reports: { studenExams: APIStudentExamResponse[] ,total:number}) => {
            const requests = reports.studenExams.filter(report => report.finishedAt)
            .map((report: APIStudentExamResponse) =>
              this.getStudentExamWithQuestions(report.oid).pipe(
                map((examDetails) => {
                  const summary = this.mapStatusSummary(examDetails.statusSummary);

                  return {
                    ...report,
                    summary
                  };
                })
              )
            );

            return forkJoin(requests);
          })
        )
        .subscribe((finalReports) => {
          this.reports.set(finalReports);
          this.loadedExamId.set(examId);
        });
    }
    // loadReports(studentId: string) {
    //   this.getStudentExamsByStudentId(studentId)
    //     .subscribe(r => {

    //       const mapped = r.map((report: any) => ({
    //         ...report,
    //         summary: this.mapStatusSummary(report.statusSummary)
    //       }));

    //       console.log('reports', mapped);
    //       this.reports.set(mapped);
    //     });
    // }

    // loadReports(studentId: string) {
    //   this.getStudentExamsByStudentId(studentId)
    //     .subscribe(r => {console.log('reports',r);this.reports.set(r);});
    // }

    startExam(body: startStudentExam): Observable < APIStudentExamResponse > {
      return this.apiService
        .post<ApiResponse<APIStudentExamResponse>>('StudentExams/start', body, "examToast.start")
        .pipe(
          map((response: ApiResponse<APIStudentExamResponse>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to start exam';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

    // submitExam(body: submitStudentExam, message: string ='examToast.submitted')
    // : Observable<APIStudentExamResponse> {
    //   return this.apiService
    //     .post<ApiResponse<APIStudentExamResponse>>('StudentExams/submit', body, message)
    //     .pipe(
    //       map((response: ApiResponse<APIStudentExamResponse>) => {
    //         if (!response.success) {
    //           const msg = response.errors?.join(', ') || response.message || 'API failed to submit exam';
    //           throw new Error(msg);
    //         }
    //         console.log('response',response);
    //         this.loadReports(this.auth.loggedStudent()?.userId!)
    //         return response.data;
    //       })
    //     );
    // }

    submitExam(
      body: submitStudentExam,
      message: string = 'examToast.submitted'
    ): Observable < APIStudentExamResponse > {
      return this.apiService
        .post<ApiResponse<APIStudentExamResponse>>('StudentExams/submit', body, message)
        .pipe(
          switchMap((response: ApiResponse<APIStudentExamResponse>) => {
            if (!response.success) {
              const msg =
                response.errors?.join(', ') ||
                response.message ||
                'API failed to submit exam';
              throw new Error(msg);
            }

            const newExam = response.data;

            return this.getStudentExamWithQuestions(newExam.oid).pipe(
              map((detailedExam) => {
                const summary = this.mapStatusSummary(detailedExam.statusSummary);
                this.updateReport({
                  ...detailedExam,
                  summary
                });

                return newExam;
              })
            );
          })
        );
    }

    updateReport(newExam: any) {
      this.reports.update(list => {
        const index = list.findIndex(r => r.oid === newExam.oid);

        let newList;

        if (index === -1) {
          newList = [...list, { ...newExam }];
        } else {
          newList = list.map(r =>
            r.oid === newExam.oid
              ? { ...r, ...newExam, summary: newExam.summary }
              : r
          );
        }

        return [...newList];
      });
    }

    getExamSummary(body: ExamSummary): Observable < APIExamSummary > {
      return this.apiService
        .post<ApiResponse<APIExamSummary>>('StudentExams/summary', body,)
        .pipe(
          map((response: ApiResponse<APIExamSummary>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to get summary';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }
    getStudentExam(id: string): Observable < APIStudentExamResponse > {
      return this.apiService
        .getSingle<ApiResponse<APIStudentExamResponse>>('StudentExams', id)
        .pipe(
          map((response: ApiResponse<APIStudentExamResponse>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to load student exam';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

    getStudentExamWithQuestions(id: string): Observable < APIStudentExamResponse > {
      return this.apiService
        .getSingle<ApiResponse<APIStudentExamResponse>>('StudentExams', id, 'studentExam')
        .pipe(
          map((response: ApiResponse<APIStudentExamResponse>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to load student exam';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }
    getStudentExamsByStudentId(id: string): Observable < APIStudentExamResponse[] > {
      return this.apiService
        .getSingle<ApiResponse<APIStudentExamResponse[]>>('StudentExams/student', id)
        .pipe(
          map((response: ApiResponse<APIStudentExamResponse[]>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to load student exam';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

    deleteStudentExam(id: string): Observable < boolean > {
      return this.apiService
        .delete<ApiResponse<boolean>>('StudentExams', id)
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

    updateExamStatus(id: string, body: any): Observable < APIStudentExamResponse > {
      const updateBody: any = {
        ...body,
        oid: id,
      };

      return this.apiService
        .put<ApiResponse<APIStudentExamResponse>>('StudentExams', id, updateBody, 'examToast.clear')
        .pipe(
          map((response: ApiResponse<APIStudentExamResponse>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to update exam';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

    searchStudentExam(body: RequestBody): Observable < { studenExams: APIStudentExamResponse[]; total: number } > {
      return this.apiService
        .query<ApiSearchResponse<APIStudentExamResponse>>('StudentExams/search', body)
        .pipe(
          map((response: ApiSearchResponse<APIStudentExamResponse>) => {
            if (!response.success) {
              const msg = response.message || 'API failed to query';
              throw new Error(msg);
            }
            return {
              studenExams: response.data ?? [],
              total: response.totalPages ?? 0,
            };
          })
        );
    }

    submitchoiceExamQuestion(body: choiceQuestionExamSubmit): Observable < string > {
      return this.apiService
        .post<ApiResponse<string>>('StudentExamQuestions/submit-multiple', body)
        .pipe(
          map((response: ApiResponse<string>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to start exam';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }


    submitMatchingExamQuestion(body: matchingQuestionExamSubmit): Observable < string > {
      return this.apiService
        .post<ApiResponse<string>>('StudentExamQuestions/validate-answers', body)
        .pipe(
          map((response: ApiResponse<string>) => {
            if (!response.success) {
              const msg = response.errors?.join(', ') || response.message || 'API failed to start exam';
              throw new Error(msg);
            }
            return response.data;
          })
        );
    }

    getExamPayload(report: APIExamSummary) {
      const payload = {
        oid: report.studentExamOid,
        totalScore: report.totalScore,
        obtainedScore: report.obtainedScore,
        passPercent: report.percentage != null ? Math.round(report.percentage) : null,
        isPassed: report.isPassed,
        // examStatusLookupId: "12516b05-9d35-4499-9122-9561dfb4a9ce",
        examStatusLookupId: clearedExamStatusOid,
        examModeLookupId: report.examModeLookupId,
        finishedAt: report.finishedAt,
        // updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        updatedBy: createdUpdatedOID
      }

      return payload;
    }

    clearLessonLearnedQuestions(report: APIExamSummary): Observable < APIStudentExamResponse > {
      const payload = this.getExamPayload(report);

      return this.updateExamStatus(payload.oid!, payload).pipe(
        map((res) => {
          this.latestReport.set(null);
          return res;
        })
      );
    }

    loadLatestReport(): void {
      const payload: ExamSummary = {
        studentId: this.auth.loggedStudent()?.userId!,
        masrterExamId: this.shared.currentExamId()
      };

      this.getExamSummary(payload).subscribe({
        next: (report) => { console.log('latest report', report); this.latestReport.set(report); },
        error: (err) => console.log(err)
      });
    }

    mapStatusSummary(statusSummary: any[]) {
      let correct = 0;
      let incorrect = 0;
      let notAnswered = 0;
      statusSummary?.forEach((s: any) => {
        const name = s.statusName?.toLowerCase();

        if (name == 'correct') {
          correct = s.count;
        } else if (name == 'incorrect') {
          incorrect = s.count;
        } else if (name.includes('not')) {
          notAnswered = s.count;
        }
      });

      return { correct, incorrect, notAnswered };
    }
  }
