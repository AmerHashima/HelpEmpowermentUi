import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  hasBought=signal<boolean>(false);
  constructor() { }
}
