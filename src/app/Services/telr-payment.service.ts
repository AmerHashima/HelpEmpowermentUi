import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiProblemDetails, PaymentStatusResponse, TelrCheckoutResponse } from '../models/telr-payment';

const STORAGE_KEY = 'telr.pending-payment';

@Injectable({ providedIn: 'root' })
export class TelrPaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/payments/telr`;

  checkout(couponCode: string | null): Observable<TelrCheckoutResponse> {
    return this.http.post<TelrCheckoutResponse>(`${this.baseUrl}/checkout`, { couponCode }).pipe(
      switchMap(response => {
        if (!this.isAllowedPaymentUrl(response.payment.paymentUrl)) {
          return throwError(() => ({ errorCode: 'INVALID_PAYMENT_URL' } satisfies ApiProblemDetails));
        }
        return [response];
      }),
      catchError(error => this.mapError(error))
    );
  }

  getStatus(paymentId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${this.baseUrl}/status/${encodeURIComponent(paymentId)}`).pipe(
      catchError(error => this.mapError(error))
    );
  }

  savePending(paymentId: string, invoiceId: string): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ paymentId, invoiceId, createdAt: new Date().toISOString() }));
  }
  getPending(): { paymentId: string; invoiceId: string } | null {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as { paymentId: string; invoiceId: string } | null; }
    catch { return null; }
  }
  clearPending(): void { sessionStorage.removeItem(STORAGE_KEY); }

  private isAllowedPaymentUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && environment.telrAllowedHosts.includes(url.hostname.toLowerCase());
    } catch { return false; }
  }
  private mapError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const body = typeof error.error === 'object' && error.error !== null ? error.error as ApiProblemDetails : {};
      return throwError(() => ({ ...body, status: error.status } satisfies ApiProblemDetails));
    }
    return throwError(() => error);
  }
}
