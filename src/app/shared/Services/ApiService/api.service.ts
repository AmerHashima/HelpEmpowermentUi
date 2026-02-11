// src\app\shared\Services\ApiService\api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';

@Injectable({ providedIn: 'root' })
export default class ApiService {
  private readonly baseUrl: string = environment.baseUrl;
  // private token='';
  constructor(
    private http: HttpClient,
    private toasting: ToastingMessagesService
  ) {

  }

  // Helper to create headers with optional token
  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // const token = this.authService.getToken();
    // if (token) {
    //   headers = headers.set('Authorization', `bearer ${token}`);
    // }
    return headers;
  }



  // get<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
  // const httpParams = new HttpParams({ fromObject: params || {} });
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, {
      headers: this.createHeaders(),
    });
  }

  getSingle<T>(url: string, id: string,type?:string): Observable<T> {
    let fullUrl='' ;
    if(type == 'question')
      fullUrl = `${this.baseUrl}/${url}/${id}/with-answers`;
    else
     fullUrl = `${this.baseUrl}/${url}/${id}`;
    return this.http.get<T>(fullUrl, { headers: this.createHeaders() });
  }

  post<T>(url: string, body: any, successMessage: string = 'Success'): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(),
    }).pipe(
      tap(() => {
        if (successMessage) {
          this.toasting.showToast(successMessage, 'success');
        }
      })
    );
  }


  put<T>(url: string, id: string, body: any, successMessage: string = 'Success'): Observable<T> {
    // const fullUrl = `${this.baseUrl}/${url}/${id}`;
    const fullUrl = `${this.baseUrl}/${url}`;
    return this.http.put<T>(fullUrl, body, { headers: this.createHeaders() }).pipe(
      tap(() => {
        if (successMessage) {
          this.toasting.showToast(successMessage, 'success');
        }
      })
    );
  }

  // delete<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
  delete<T>(url: string, id: string, successMessage: string = 'Success'): Observable<T> {
    // const httpParams = new HttpParams({ fromObject: params || {} });
    const fullUrl = `${this.baseUrl}/${url}/${id}`;
    return this.http.delete<T>(fullUrl, {
      // params: httpParams,
      headers: this.createHeaders(),
    }).pipe(
      tap(() => {
        if (successMessage) {
          this.toasting.showToast(successMessage, 'success');
        }
      })
    );
  }

  query<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(),
    });
  }

}
