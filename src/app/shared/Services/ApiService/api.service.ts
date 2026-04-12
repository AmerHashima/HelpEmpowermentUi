// // src\app\shared\Services\ApiService\api.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Observable, finalize, tap } from 'rxjs';
// import { environment } from '../../../../environments/environment';
// import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';
// import { LoadingService } from '../Loading/loading.service';
// import ApiStatusService from './api-status.service';

// @Injectable({ providedIn: 'root' })
// export default class ApiService {
//   private readonly baseUrl: string = environment.baseUrl;

//   // private token='';
//   constructor(
//     private http: HttpClient,
//     private toasting: ToastingMessagesService,
//     private loader: LoadingService,
//   ) {

//   }

//   // Helper to create headers with optional token
//   private createHeaders(): HttpHeaders {
//     let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     // const token = this.authService.getToken();
//     // if (token) {
//     //   headers = headers.set('Authorization', `bearer ${token}`);
//     // }
//     return headers;
//   }



//   // get<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
//   // const httpParams = new HttpParams({ fromObject: params || {} });
//   get<T>(url: string): Observable<T> {
//     this.loader.start();
//     return this.http.get<T>(`${this.baseUrl}/${url}`, {
//       headers: this.createHeaders(),
//     }).pipe(
//       finalize(() => this.loader.stop())
//     );
//   }

//   getSingle<T>(url: string, id: string, type?: string): Observable<T> {
//     let fullUrl = '';
//     if (type == 'question')
//       fullUrl = `${this.baseUrl}/${url}/${id}/with-answers`;
//     if (type == 'studentExam')
//       fullUrl = `${this.baseUrl}/${url}/${id}/with-questions`;
//     else
//       fullUrl = `${this.baseUrl}/${url}/${id}`;
//     this.loader.start();
//     return this.http.get<T>(fullUrl, { headers: this.createHeaders() }).pipe(
//       finalize(() => this.loader.stop())
//     );
//   }

//   post<T>(url: string, body: any, successMessage: string = 'Success'): Observable<T> {
//     this.loader.start();
//     return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
//       headers: this.createHeaders(),
//     }).pipe(
//       tap(() => {
//         if (successMessage && !url.includes('search') && !url.includes('en-to-ar') && !url.includes('submit-multiple') &&
//           !url.includes('validate-answers') && !url.includes('refresh-token') &&
//           !url.includes('summary') ) {
//           this.toasting.showToast(successMessage, 'success');
//         }
//       }),
//       finalize(() => this.loader.stop())
//     );
//   }



//   put<T>(url: string, id: string, body: any, successMessage: string = 'Success', type?: string): Observable<T> {
//     // const fullUrl = `${this.baseUrl}/${url}`;
//     let fullUrl = '';
//     if (type == 'payment')
//       fullUrl = `${this.baseUrl}/${url}/${id}/payment`;
//     if (type == 'progress')
//       fullUrl = `${this.baseUrl}/${url}/${id}/progress`;
//     else
//       fullUrl = `${this.baseUrl}/${url}`;
//     this.loader.start();
//     return this.http.put<T>(fullUrl, body, { headers: this.createHeaders() }).pipe(
//       tap(() => {
//         if (successMessage) {
//           this.toasting.showToast(successMessage, 'success');
//         }
//       }),
//       finalize(() => this.loader.stop())
//     );
//   }

//   // delete<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
//   delete<T>(url: string, id: string, successMessage: string = 'Success'): Observable<T> {
//     // const httpParams = new HttpParams({ fromObject: params || {} });
//     const fullUrl = `${this.baseUrl}/${url}/${id}`;
//     this.loader.start();
//     return this.http.delete<T>(fullUrl, {
//       // params: httpParams,
//       headers: this.createHeaders(),
//     }).pipe(
//       tap(() => {
//         if (successMessage) {
//           this.toasting.showToast(successMessage, 'success');
//         }
//       }),
//       finalize(() => this.loader.stop())
//     );
//   }

//   clear<T>(url: string, id: string, successMessage: string = 'Success'): Observable<T> {
//     // const httpParams = new HttpParams({ fromObject: params || {} });
//     const fullUrl = `${this.baseUrl}/${url}/${id}/clear`;
//     this.loader.start();
//     return this.http.delete<T>(fullUrl, {
//       // params: httpParams,
//       headers: this.createHeaders(),
//     }).pipe(
//       tap(() => {
//         if (successMessage) {
//           this.toasting.showToast(successMessage, 'success');
//         }
//       }),
//       finalize(() => this.loader.stop())
//     );
//   }

//   query<T>(url: string, body: any): Observable<T> {
//     this.loader.start();
//     return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
//       headers: this.createHeaders(),
//     }).pipe(
//       finalize(() => this.loader.stop())
//     );
//   }

// }


// src/app/shared/Services/ApiService/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
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

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private shouldBlockRequest(url: string): boolean {
    if (this.apiStatus.isServerDown()) {
      console.log('🚫 Blocked request (server down):', url);
      return true;
    }
    return false;
  }

  get<T>(url: string): Observable<T> {
    if (this.shouldBlockRequest(url)) {
      return new Observable<T>((observer) => observer.complete());
    }

    this.loader.start();

    return this.http.get<T>(`${this.baseUrl}/${url}`, {
      headers: this.createHeaders(),
    }).pipe(
      finalize(() => this.loader.stop())
    );
  }

  getSingle<T>(url: string, id: string, type?: string): Observable<T> {
    if (this.shouldBlockRequest(url)) {
      return new Observable<T>((observer) => observer.complete());
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
      finalize(() => this.loader.stop())
    );
  }

  post<T>(
    url: string,
    body: any,
    successMessage: string = 'Success'
  ): Observable<T> {
    if (this.shouldBlockRequest(url)) {
      return new Observable<T>((observer) => observer.complete());
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
          !url.includes('forgot-password')
        ) {
          this.toasting.showToast(successMessage, 'success');
        }
      }),
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
    if (this.shouldBlockRequest(url)) {
      return new Observable<T>((observer) => observer.complete());
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
      finalize(() => this.loader.stop())
    );
  }

  delete<T>(
    url: string,
    id: string,
    successMessage: string = 'Success'
  ): Observable<T> {
    if (this.shouldBlockRequest(url)) {
      return new Observable<T>((observer) => observer.complete());
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
      finalize(() => this.loader.stop())
    );
  }

  clear<T>(
    url: string,
    id: string,
    successMessage: string = 'Success'
  ): Observable<T> {
    if (this.shouldBlockRequest(url)) {
      return new Observable<T>((observer) => observer.complete());
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
      finalize(() => this.loader.stop())
    );
  }

  // ==================== QUERY ====================
  query<T>(url: string, body: any): Observable<T> {
    if (this.shouldBlockRequest(url)) {
      return new Observable<T>((observer) => observer.complete());
    }

    this.loader.start();

    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(),
    }).pipe(
      finalize(() => this.loader.stop())
    );
  }

  // ==================== FILE UPLOAD ====================
  uploadImage<T>(endpoint: string, id: string, file: File): Observable<T> {
    if (this.shouldBlockRequest(endpoint)) {
      return new Observable<T>((observer) => observer.complete());
    }

    const formData = new FormData();
    formData.append('image', file);

    this.loader.start();

    return this.http.post<T>(`${this.baseUrl}/${endpoint}/${id}/image`, formData).pipe(
      finalize(() => this.loader.stop())
    );
  }

  getImageUrl(endpoint: string, id: string): string {
    return `${this.baseUrl}/${endpoint}/${id}/image`;
  }

  getImage(endpoint: string, id: string): Observable<Blob> {
    if (this.shouldBlockRequest(endpoint)) {
      return new Observable<Blob>((observer) => observer.complete());
    }
    this.loader.start();
    return this.http.get(`${this.baseUrl}/${endpoint}/${id}/image`, { responseType: 'blob' }).pipe(
      finalize(() => this.loader.stop())
    );
  }
}
