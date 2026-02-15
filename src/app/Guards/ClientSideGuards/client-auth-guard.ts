import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Shared } from '../../shared/Services/shared/shared';

export const clientAuthGuard: CanActivateFn = (route, state) => {
  const shared = inject(Shared);
  const authService = inject(AuthService);

  const router = inject(Router);

  const user = authService.loggedStudent();

  if (user && user.oid) {
    return true;
  }

  return router.createUrlTree([`/${shared.lang()}/auth/login`]);
}


export const clientGuestGuard: CanActivateFn = (route, state) => {
  const shared = inject(Shared);
  const authService = inject(AuthService);

  const router = inject(Router);

  const user = authService.loggedStudent();

  if (user && user.oid) {
    return router.createUrlTree([`/${shared.lang()}/home`]);
  }

  return true
}

