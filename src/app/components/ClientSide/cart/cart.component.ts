import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { CartService } from '../../../Services/  cart.service';
import { APICartItem, CartItem } from '../../../models/cart';
import { Router } from '@angular/router';



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
  lang=this.shared.lang;
  isRTL=this.shared.isRtl;
  cartItems = this.cartService.cartItems;
  removeItem(cartItem: APICartItem) {
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
}





