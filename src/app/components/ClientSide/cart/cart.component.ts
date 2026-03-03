import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { CartService } from '../../../Services/  cart.service';
import { APICartItem, CartItem } from '../../../models/cart';
import { Router } from '@angular/router';

type ReservationType =
  | 'examSimulationReserv'
  | 'recordedCourseReserv'
  | 'liveCourseReserv';

interface CartViewItem extends APICartItem {
  reservationType: ReservationType;
}

@Component({
  selector: 'app-cart',
  imports: [TitleCasePipe, SiteButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private shared=inject(Shared);
  private cartService = inject(CartService);
  private router=inject(Router);
  appliedCoupon=this.cartService.appliedCoupon;
  discountAmount = this.cartService.discountAmount;
  subtotal = this.cartService.subtotal;
  total=this.cartService.total;
  lang=this.shared.lang;
  isRTL=this.shared.isRtl;
  cartItems = this.cartService.cartItems;
  expandedCartItems = computed<CartViewItem[]>(() => {

    const result: CartViewItem[] = [];

    for (const item of this.cartItems()) {

      if (item.examSimulationReserv) {
        result.push({ ...item, reservationType: 'examSimulationReserv' });
      }

      if (item.recordedCourseReserv) {
        result.push({ ...item, reservationType: 'recordedCourseReserv' });
      }

      if (item.liveCourseReserv) {
        result.push({ ...item, reservationType: 'liveCourseReserv' });
      }
    }

    return result;
  });
  
  removeItem(cartItem: APICartItem) {
    console.log('cartItem', cartItem);
    const newCartItems = [...this.cartItems().filter((item: APICartItem) => item == cartItem)];
    this.cartItems.set(newCartItems);
  }

  getTotalPrice(): number {
    return this.cartItems().reduce(
      (total, item) => total + (item.finalPrice ?? 0),
      0
    );
  }

  BrowseCourses(){
    this.router.navigateByUrl(`/${this.lang()}/certifications/pmp`);
  }

  navigateToCheckout(){
    this.router.navigateByUrl(`/${this.lang()}/checkout`);
  }
  // decrease(item:any){}
  // increase(item:any){}
  removeCoupon(){}
applyCoupon(value:any){}
}





