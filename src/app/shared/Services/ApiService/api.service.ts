import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';
import { LoadingService } from '../Loading/loading.service';
import ApiStatusService from './api-status.service';

@Injectable({ providedIn: 'root' })
export default class ApiService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private toasting: ToastingMessagesService,
    private loader: LoadingService,
    private apiStatus: ApiStatusService
  ) { }

  // private handleError(error: any, url?: string) {
  //   // this.loader.stop();
  //   if (this.apiStatus.isServerDown()) return throwError(() => '');

  //   // const apiMessage =
  //   //   error?.error?.message ||
  //   //   error?.error?.errors?.[0] ||
  //   //   'Something went wrong';


  //   const apiMessage =
  //     error?.error?.message ||
  //     error?.error?.errors?.[0]
  //         console.error('❌ API Error:', url, error);
  //   if (apiMessage){
  //     this.toasting.showToast(apiMessage, 'error');

  //   }

  //   return throwError(() => error);
  // }


  private handleError(error: any, url?: string) {
    // this.loader.stop();
    if (this.apiStatus.isServerDown()) return throwError(() => '');

    // const apiMessage =
    //   error?.error?.message ||
    //   error?.error?.errors?.[0] ||
    //   'Something went wrong';


    // const apiMessage =
    //   error?.error?.message ||
    //   error?.error?.errors?.[0]
    // console.error('❌ API Error:', url, error);
    // if (apiMessage) {
    //   this.toasting.showToast(apiMessage, 'error');

    // }

    return throwError(() => error);
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }


  private shouldBlockRequest(url: string): boolean {
    if (this.apiStatus.isServerDown()) {
      return true;
    }
    return false;
  }

  get<T>(url: string): Observable<T> {
    // if (this.shouldBlockRequest(url)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(url)) {
      return EMPTY;
    }


    this.loader.start();

    return this.http.get<T>(`${this.baseUrl}/${url}`, {
      headers: this.createHeaders(),
    }).pipe(
      catchError(err => this.handleError(err, url)),
      finalize(() => this.loader.stop())
    );
  }

  getSingle<T>(url: string, id: string, type?: string): Observable<T> {
    // if (this.shouldBlockRequest(url)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(url)) {
      return EMPTY;
    }

    let fullUrl = '';

    if (type === 'question') {
      fullUrl = `${this.baseUrl}/${url}/${id}/with-answers`;
    } else if (type === 'studentExam') {
      fullUrl = `${this.baseUrl}/${url}/${id}/with-questions`;
    } else {
      fullUrl = `${this.baseUrl}/${url}/${id}`;
    }

    this.loader.start();

    return this.http.get<T>(fullUrl, {
      headers: this.createHeaders(),
    }).pipe(
      catchError(err => this.handleError(err, url)),
      finalize(() => this.loader.stop())
    );
  }

  post<T>(
    url: string,
    body: any,
    successMessage: string = 'Success',
    page:string='',
  ): Observable<T> {
    // if (this.shouldBlockRequest(url)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(url)) {
      return EMPTY;
    }

    this.loader.start();

    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(),
    }).pipe(
      tap(() => {
        if (
          successMessage &&
          !url.includes('search') &&
          !url.includes('en-to-ar') &&
          !url.includes('submit-multiple') &&
          !url.includes('validate-answers') &&
          !url.includes('refresh-token') &&
          !url.includes('summary') &&
          !url.includes('otp/send') &&
          !url.includes('otp/reset-password')&&
          !url.includes('enroll') &&
          !url.includes('StudentCourseReservations') &&
          (!page || page !== 'enroll')
        ) {
          this.toasting.showToast(successMessage, 'success');
        }

      }),
      catchError(err => this.handleError(err, url)),
      finalize(() => this.loader.stop())
    );
  }

  // ==================== PUT ====================
  put<T>(
    url: string,
    id: string,
    body: any,
    successMessage: string = 'Success',
    type?: string
  ): Observable<T> {
    // if (this.shouldBlockRequest(url)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(url)) {
      return EMPTY;
    }

    let fullUrl = '';

    if (type === 'payment') {
      fullUrl = `${this.baseUrl}/${url}/${id}/payment`;
    } else if (type === 'progress') {
      fullUrl = `${this.baseUrl}/${url}/${id}/progress`;
    } else {
      fullUrl = `${this.baseUrl}/${url}`;
    }

    this.loader.start();

    return this.http.put<T>(fullUrl, body, {
      headers: this.createHeaders(),
    }).pipe(
      tap(() => {
        if (
          successMessage &&
          !fullUrl.includes('progress')) {
          this.toasting.showToast(successMessage, 'success');
        }
      }),
      catchError(err => this.handleError(err, url)),
      finalize(() => this.loader.stop())
    );
  }

  delete<T>(
    url: string,
    id: string,
    successMessage: string = 'Success'
  ): Observable<T> {
    // if (this.shouldBlockRequest(url)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(url)) {
      return EMPTY;
    }

    const fullUrl = `${this.baseUrl}/${url}/${id}`;

    this.loader.start();

    return this.http.delete<T>(fullUrl, {
      headers: this.createHeaders(),
    }).pipe(
      tap(() => {
        if (successMessage) {
          this.toasting.showToast(successMessage, 'success');
        }
      }),
      catchError(err => this.handleError(err, url)),
      finalize(() => this.loader.stop())
    );
  }

  clear<T>(
    url: string,
    id: string,
    successMessage: string = 'Success'
  ): Observable<T> {
    // if (this.shouldBlockRequest(url)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(url)) {
      return EMPTY;
    }

    const fullUrl = `${this.baseUrl}/${url}/${id}/clear`;

    this.loader.start();

    return this.http.delete<T>(fullUrl, {
      headers: this.createHeaders(),
    }).pipe(
      tap(() => {
        if (successMessage) {
          this.toasting.showToast(successMessage, 'success');
        }
      }),
      catchError(err => this.handleError(err, url)),
      finalize(() => this.loader.stop())
    );
  }

  // ==================== QUERY ====================
  query<T>(url: string, body: any): Observable<T> {
    // if (this.shouldBlockRequest(url)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(url)) {
      return EMPTY;
    }

    this.loader.start();

    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(),
    }).pipe(
      catchError(err => this.handleError(err, url)),
      finalize(() => {
        this.loader.stop()
      })
    );
  }

  // ==================== FILE UPLOAD ====================
  uploadImage<T>(endpoint: string, id: string, file: File): Observable<T> {
    // if (this.shouldBlockRequest(endpoint)) {
    //   return new Observable<T>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(endpoint)) {
      return EMPTY;
    }

    const formData = new FormData();
    formData.append('image', file);

    this.loader.start();

    return this.http.post<T>(`${this.baseUrl}/${endpoint}/${id}/image`, formData).pipe(
      catchError(err => this.handleError(err, endpoint)),
      finalize(() => this.loader.stop())
    );
  }

  getImageUrl(endpoint: string, id: string): string {
    return `${this.baseUrl}/${endpoint}/${id}/image`;
  }

  getImage(endpoint: string, id: string): Observable<Blob> {
    // if (this.shouldBlockRequest(endpoint)) {
    //   return new Observable<Blob>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(endpoint)) {
      return EMPTY;
    }
    this.loader.start();
    return this.http.get(`${this.baseUrl}/${endpoint}/${id}/image`, { responseType: 'blob' }).pipe(
      catchError(err => this.handleError(err, endpoint)),
      finalize(() => this.loader.stop())
    );
  }

  deleteImage(endpoint: string, id: string): Observable<string> {
    // if (this.shouldBlockRequest(endpoint)) {
    //   return new Observable<string>((observer) => observer.complete());
    // }
    if (this.shouldBlockRequest(endpoint)) {
      return EMPTY;
    }
    this.loader.start();
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}/image`, { responseType: 'text' }).pipe(
      catchError(err => this.handleError(err, endpoint)),
      finalize(() => this.loader.stop())
    );
  }

  uploadFile<T>( url: string, file: File, fieldName: string = 'file',successMessage: string = 'Success'

  ): Observable<T> {

    if (this.shouldBlockRequest(url)) {

      return EMPTY;

    }

    const formData = new FormData();

    formData.append(fieldName, file);

    this.loader.start();

    return this.http.post<T>(

      `${this.baseUrl}/${url}`,

      formData

    ).pipe(

      tap(() => {

        if (successMessage) {

          this.toasting.showToast(successMessage, 'success');

        }

      }),

      catchError(err => this.handleError(err, url)),

      finalize(() => this.loader.stop())

    );

  }

  getFile(url: string): Observable<Blob> {

    if (this.shouldBlockRequest(url)) {

      return EMPTY;

    }

    this.loader.start();

    return this.http.get(

      `${this.baseUrl}/${url}`,

      {

        responseType: 'blob'

      }

    ).pipe(

      catchError(err => this.handleError(err, url)),

      finalize(() => this.loader.stop())

    );
  }

  getFileUrl(url: string): string {

    return `${this.baseUrl}/${url}`;

  }

  deleteFile(url: string): Observable<string> {

    if (this.shouldBlockRequest(url)) {

      return EMPTY;

    }

    this.loader.start();

    return this.http.delete(

      `${this.baseUrl}/${url}`,

      {

        responseType: 'text'

      }

    ).pipe(

      catchError(err => this.handleError(err, url)),

      finalize(() => this.loader.stop())

    );

  }
}
