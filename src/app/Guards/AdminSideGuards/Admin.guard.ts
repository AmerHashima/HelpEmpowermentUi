import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Shared } from "../../shared/Services/shared/shared";
import { AuthService } from "../../Services/auth.service";

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const shared = inject(Shared);
  const authService = inject(AuthService);

  const adminToken = authService.adminToken(); 

  if (adminToken) {
    return true;
  }

  return router.createUrlTree([`/${shared.lang()}/auth/login`]);
};
