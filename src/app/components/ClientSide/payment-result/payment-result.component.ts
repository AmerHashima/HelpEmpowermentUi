import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, Subject, catchError, exhaustMap, finalize, switchMap, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { PaymentStatus, PaymentStatusResponse } from '../../../models/telr-payment';
import { TelrPaymentService } from '../../../Services/telr-payment.service';

@Component({ selector: 'app-payment-result', standalone: true, imports: [RouterLink], templateUrl: './payment-result.component.html', styleUrl: './payment-result.component.scss' })
export class PaymentResultComponent {
  private route = inject(ActivatedRoute); private service = inject(TelrPaymentService); private destroyRef = inject(DestroyRef);
  private refreshClicks = new Subject<void>();
  readonly status = PaymentStatus; readonly loading = signal(true); readonly timedOut = signal(false);
  readonly result = signal<PaymentStatusResponse | null>(null); readonly error = signal('');
  private paymentId = this.route.snapshot.queryParamMap.get('paymentId') ?? this.service.getPending()?.paymentId ?? '';

  constructor() {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(this.paymentId)) {
      this.loading.set(false); this.error.set('The payment reference is invalid or missing.'); return;
    }
    this.refreshClicks.pipe(exhaustMap(() => this.poll()), takeUntilDestroyed(this.destroyRef)).subscribe();
    this.refresh();
  }
  refresh(): void { this.timedOut.set(false); this.refreshClicks.next(); }
  private poll() {
    this.loading.set(true); this.error.set(''); let final = false;
    const deadline = timer(60000).pipe(tap(() => { if (!final) this.timedOut.set(true); }));
    return timer(0, 3000).pipe(
      switchMap(() => this.service.getStatus(this.paymentId)),
      tap(result => { this.result.set(result); final = this.isFinal(result.status); if (final) this.service.clearPending(); }),
      takeWhile(result => !this.isFinal(result.status), true), takeUntil(deadline),
      catchError(() => { this.error.set('We could not confirm the payment. Please try refreshing the status.'); return EMPTY; }),
      finalize(() => this.loading.set(false))
    );
  }
  private isFinal(status: PaymentStatus): boolean {
    return [PaymentStatus.Authorised, PaymentStatus.Declined, PaymentStatus.Cancelled, PaymentStatus.Failed, PaymentStatus.Expired, PaymentStatus.Refunded].includes(status);
  }
}
