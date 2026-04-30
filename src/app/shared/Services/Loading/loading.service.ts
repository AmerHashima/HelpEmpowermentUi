import { Injectable } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // readonly loading$ = this.loadingSubject.asObservable();
  loading$ = this.loadingSubject.asObservable().pipe(
    delay(0)
  );
  start(): void {
    this.activeRequests += 1;
    console.log('START →', this.activeRequests);

    if (this.activeRequests === 1) {
      this.loadingSubject.next(true);
    }
  }

  stop(): void {
    if (this.activeRequests > 0) {
      this.activeRequests -= 1;
    }
    console.log('STOP →', this.activeRequests);
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
    }
  }
}
