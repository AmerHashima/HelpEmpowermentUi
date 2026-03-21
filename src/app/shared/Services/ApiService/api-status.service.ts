// src\app\shared\Services\ApiService\api.service.ts
import { Injectable, signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export default class ApiStatusService {
  private _isDown = signal(false);

  isServerDown = this._isDown.asReadonly();

  setDown() {
    if (!this._isDown()) {
      this._isDown.set(true);
    }
  }

  setUp() {
    if (this._isDown()) {
      this._isDown.set(false);
    }
  }
}
