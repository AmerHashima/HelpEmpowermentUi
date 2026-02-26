import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../../Services/  cart.service';
import { Shared } from '../../shared/Services/shared/shared';

export const checkoutGuard: CanActivateFn = () => {

  const cartService = inject(CartService);
  const shared=inject(Shared);
  const router = inject(Router);

  const hasItems = cartService.cartItems().length > 0;
  console.log('hasItems', hasItems);
  if (!hasItems) {
    router.navigateByUrl(`/${shared.lang()}/cart`);
    return false;
  }

  return true;
};
