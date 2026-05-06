import { Component, computed, effect, inject, Input } from '@angular/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { CartService, CartViewItem, ReservationType } from '../../../Services/  cart.service';
import { APICartItem } from '../../../models/cart';
import { Router } from '@angular/router';
import { StudentService } from '../../../Services/student-service.service';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';

// type ReservationType =
//   | 'examSimulationReserv'
//   | 'recordedCourseReserv'
//   | 'liveCourseReserv';

// interface CartViewItem extends APICartItem {
//   reservationType: ReservationType;
// }

@Component({
  selector: 'app-cart',
  imports: [SiteButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private shared = inject(Shared);
  private cartService = inject(CartService);
  private studentService=inject(StudentService);
  private toasting=inject(ToastingMessagesService);
  student = this.studentService.innerStudent;
  private router = inject(Router);
  appliedCoupon = this.cartService.appliedCoupon;

  discountAmount = this.cartService.discountAmount;
  subtotal = this.cartService.subtotal;
  total = this.cartService.total;
  lang = this.shared.lang;
  isRTL = this.shared.isRtl;
  cartItems = this.cartService.cartItems;
  expandedCartItems = this.cartService.expandedCartItems;



  removeItem(item: CartViewItem) {
    const course = this.cartService.getCourse(item.courseId);
    if (!course) return;

    if (this.isSingleFeature(course)) {
      this.deleteWholeItem(course.oid);
    } else {
      this.removeSingleFeature(course, item.reservationType);
    }
  }

  private isSingleFeature(course: APICartItem): boolean {
    const count =
      (course.examSimulationReserv ? 1 : 0) +
      (course.recordedCourseReserv ? 1 : 0) +
      (course.liveCourseReserv ? 1 : 0);

    return count === 1;
  }
  private deleteWholeItem(oid: string): void {
    this.cartService.deleteCartItem(oid).subscribe({
      next: () => {
        this.cartService.cartItems.update(items =>
          items.filter(i => i.oid !== oid)
        );
      }
    });
  }

  private removeSingleFeature(
    course: APICartItem,
    feature: ReservationType
  ): void {
    const payload = this.buildFeaturePayload(course, feature, false);

    this.cartService.updateCartItem(course.oid, payload).subscribe({
      next: (updated) => {
        this.cartService.updateBasket(updated);
      }
    });
  }

  private buildFeaturePayload(
    course: APICartItem,
    feature: ReservationType,
    value: boolean
  ) {
    return {
      oid: course.oid,
      quantity: course.quantity,
      couponCode: course.couponCode,

      examSimulationReserv:
        feature === 'examSimulationReserv'
          ? value
          : course.examSimulationReserv,

      recordedCourseReserv:
        feature === 'recordedCourseReserv'
          ? value
          : course.recordedCourseReserv,

      liveCourseReserv:
        feature === 'liveCourseReserv'
          ? value
          : course.liveCourseReserv
    };
  }
  getTotalPrice(): number {
    return this.cartItems().reduce(
      (total, item) => total + (item.finalPrice ?? 0),
      0
    );
  }

  BrowseCourses() {
    this.router.navigateByUrl(`/${this.lang()}/certifications/pmp`);
  }

  navigateToCheckout() {
    this.router.navigateByUrl(`/${this.lang()}/checkout`);
  }
  removeCoupon() {
    this.cartService.clearCouponState();
    this.cartService.getStudentBasketItems().subscribe({
      next: (data) => this.cartService.cartItems.set(data.items ?? []),
      error: () => this.cartService.cartItems.set([])
    });
  }

  applyCoupon(value: string) {
    const couponCode = value?.trim();
    // if (!couponCode) return;
    // if (couponCode !== this.student()?.promoCode) {
    //   this.toasting.showToast('This coupon is invalid','error');
    //   return;}
    this.cartService.addCoupon({ couponCode }).subscribe({
      next: (data) => {
        this.cartService.applyCouponData(data, couponCode);
      }
    });
  }

  getCourdeUpperCase(name: string) {
    return name.toUpperCase();
  }
  getFeaturePrice(item: any): number {
    return this.cartService.getFeaturePrice(item);
  }

  getCourseImage(item: any) {
    switch (item.courseName.toLowerCase()) {
      case 'pmp': return '/assets/images/certifications/certfication_1.jpeg'
      case 'capm': return '/assets/images/certifications/certfication_2.jpeg'
      default: return ''
    }
  }
}





