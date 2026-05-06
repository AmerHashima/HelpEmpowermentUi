import { computed, effect, inject, Injectable, signal, } from '@angular/core';
import { APICartItem, APICartResponse, APICheckout, APICouponData, CartItem, UpdateCartItem } from '../models/cart';
import ApiService from '../shared/Services/ApiService/api.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Shared } from '../shared/Services/shared/shared';

type ReservationKey =
  | 'examSimulationReserv'
  | 'recordedCourseReserv'
  | 'liveCourseReserv';

export type ReservationType =
  | 'examSimulationReserv'
  | 'recordedCourseReserv'
  | 'liveCourseReserv';
export interface CartViewItem extends APICartItem {
  reservationType: ReservationType;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private auth = inject(AuthService);
  private shared = inject(Shared);

  studentId = computed(() => this.auth.loggedStudent()?.userId);
  cartItems = signal<APICartItem[]>([]);
  currentBasketId = signal<string>('');
  // cartCount = computed(() =>
  //   this.cartItems().reduce((total, item) => total + item.quantity, 0)
  // );
  cartCount = computed(() =>
    this.expandedCartItems().reduce((total, item) => total + item.quantity, 0)
  );

  appliedCoupon = signal<string | null>(null);
  discountAmount = signal<number>(0);
  private subTotalOverride = signal<number | null>(null);
  private totalOverride = signal<number | null>(null);

  // subtotal = computed(() =>
  //   this.cartItems().reduce((total, item) => total + (item.finalPrice ?? 0), 0)
  // );

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
  total = computed(() => {
    const override = this.totalOverride();
    if (override != null) return override;
    return this.subtotal() - this.discountAmount();
  });

  // subtotal = computed(() =>
  //   this.cartItems().reduce((total, item) => {
  //     const price =
  //       item.finalPrice && item.finalPrice > 0
  //         ? item.finalPrice
  //         : this.getFeaturePrice(item);

  //     return total + price;
  //   }, 0)
  // );
  subtotal = computed(() => {
    const override = this.subTotalOverride();
    if (override) return override;
    const sub = this.expandedCartItems().reduce((total, item) => {
      const price = this.getFeaturePrice(item);
      return total + price;
    }, 0);
    return sub;
  });
  // subtotal = computed(() =>
  //   this.expandedCartItems().reduce((total, item) => {
  //     const price =
  //       item.finalPrice && item.finalPrice > 0
  //         ? item.finalPrice
  //         : this.getFeaturePrice(item);
  //      console.log('item',item);
  //     console.log('total', total);
  //     return total + price;
  //   }, 0)
  // );
  constructor(private apiService: ApiService) {
    // toObservable(this.studentId)
    //   .pipe(
    //     filter(id => !!id),
    //     switchMap(() => this.getStudentBasketItems())
    //   )
    //   .subscribe({
    //     next: (data) => {
    //       this.cartItems.set(data.items ?? []);
    //       // this.currentBasketId.set(data.oid ?? '');
    //     },
    //     error: () => {
    //       this.cartItems.set([]);
    //     }
    //   });
    effect(() => {
      const id = this.studentId();

      if (!id) {
        this.cartItems.set([]);
        this.currentBasketId.set('');
        return;
      }

      this.getStudentBasketItems().subscribe({
        next: (data) => {
          this.cartItems.set(data.items ?? []);
          this.subTotalOverride.set(null);
          this.totalOverride.set(null);
          this.discountAmount.set(0);
          this.appliedCoupon.set(null);
        },
        error: (err) => {
          console.error('Failed to load basket', err);
          this.cartItems.set([]);
        }
      });

    });
  }


  getFeaturePrice(item: any): number {
    const course = this.shared.certifications().find(
      (c: any) => c.oid === item.courseId
    );

    const map: any = {
      recordedCourseReserv: 'recordedCourseReservPrice',
      examSimulationReserv: 'examSimulationReservPrice',
      liveCourseReserv: 'liveCourseReservPrice'
    };

    const feature =
      item.reservationType ||
      (item.examSimulationReserv && 'examSimulationReserv') ||
      (item.recordedCourseReserv && 'recordedCourseReserv') ||
      (item.liveCourseReserv && 'liveCourseReserv');

    const apiValue = course?.[map[feature]];

    const defaults: any = {
      capm: {
        examSimulationReserv: 199,
        recordedCourseReserv: 199,
        liveCourseReserv: 579
      },
      pmp: {
        examSimulationReserv: 199,
        recordedCourseReserv: 299,
        liveCourseReserv: 579
      },
      default: {
        examSimulationReserv: 150,
        recordedCourseReserv: 120,
        liveCourseReserv: 300
      }
    };

    const courseKey = item.courseName?.toLowerCase();

    const fallback =
      defaults[courseKey]?.[feature] ??
      defaults.default?.[feature] ??
      0;

    return apiValue != null && apiValue !== 0
      ? Number(apiValue)
      : fallback;
  }
  getStudentBasketItems(): Observable<APICartResponse> {
    return this.apiService
      .getSingle<ApiResponse<APICartResponse>>('StudentBaskets', this.studentId()!)
      .pipe(
        map((response: ApiResponse<APICartResponse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student basket';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  addCartItem(body: CartItem): Observable<APICartItem> {
    return this.apiService
      .post<ApiResponse<APICartItem>>('StudentBaskets', body, "Item has been added successfully to cart!")
      .pipe(
        map((response: ApiResponse<APICartItem>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to add cart item';
            throw new Error(msg);
          }
          this.currentBasketId.set(response.data.oid);
          return response.data;
        })
      );
  }

  chekout(body: { "paymentMethod": "string" }): Observable<APICheckout> {
    const url = `StudentBaskets/${this.studentId()!}/checkout`
    return this.apiService
      .post<ApiResponse<APICheckout>>(url, body, "Checkout has been successfully completed")
      .pipe(
        map((response: ApiResponse<APICheckout>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to checkout';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  // addCoupon(body: { "couponCode": "string" }): Observable<APICheckout> {
  //   const url = `StudentBaskets/${this.currentBasketId()}/coupon`
  //   return this.apiService
  //     .post<ApiResponse<APICheckout>>(url, body, "Copuon has been successfully completed")
  //     .pipe(
  //       map((response: ApiResponse<APICheckout>) => {
  //         if (!response.success) {
  //           const msg = response.errors?.join(', ') || response.message || 'API failed to checkout';
  //           throw new Error(msg);
  //         }
  //         return response.data;
  //       })
  //     );
  // }

  addCoupon(body: { couponCode: string }): Observable<APICouponData> {
    const url = `StudentBaskets/${this.auth.loggedStudent()?.userId}/coupon`

    return this.apiService
      .post<ApiResponse<APICouponData>>(url, body, "Copuon has been successfully completed")
      .pipe(
        map((response: ApiResponse<APICouponData>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to checkout';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  applyCouponData(data: APICouponData, couponCode: string): void {
    this.cartItems.set(data.items ?? []);
    this.subTotalOverride.set(data.subTotal ?? null);
    this.totalOverride.set(data.total ?? null);
    this.discountAmount.set(data.totalDiscount ?? 0);
    this.appliedCoupon.set(couponCode || null);
  }

  clearCouponState(): void {
    this.appliedCoupon.set(null);
    this.discountAmount.set(0);
    this.subTotalOverride.set(null);
    this.totalOverride.set(null);
  }
  updateCartItem(id: string, body: UpdateCartItem): Observable<APICartItem> {
    return this.apiService
      .put<ApiResponse<APICartItem>>('StudentBaskets', id, body, 'Cart Item has been updated successfully')
      .pipe(
        map((response: ApiResponse<APICartItem>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update cart item';
            throw new Error(msg);
          }
          // this.updatedLoggedStudent(response.data);
          return response.data;
        })
      );
  }
  deleteCartItem(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('StudentBaskets', id, 'Your Cart Item has been deleted successfully')
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete cart item';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  clearCart(): Observable<boolean> {
    return this.apiService
      .clear<ApiResponse<boolean>>('StudentBaskets', this.studentId()!)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete cart item';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  getCourse(courseId: string): APICartItem | undefined {
    return this.cartItems().find(item => item.courseId === courseId);
  }
  courseExists(courseId: string): boolean {
    return !!this.getCourse(courseId);
  }

  isInCart(
    courseId: string,
    key: ReservationKey
  ): boolean {

    const course = this.getCourse(courseId);

    return !!course?.[key];
  }

  // updateBasket(cartItem: APICartItem) {
  //   console.log('addedItem',cartItem);
  //   this.cartItems.update(items => {
  //     const existing = items.find(i => i.courseId === cartItem.courseId);

  //     if (!existing) {
  //       return [...items, { ...cartItem, quantity: 1 }];
  //     }
  //     else{

  //     }

  //     // return items.map(i =>
  //     //   i.courseId === cartItem.courseId
  //     //     ? { ...i, quantity: i.quantity + 1 }
  //     //     : i
  //     // );
  //   });
  // }
  updateBasket(cartItem: APICartItem) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.courseId === cartItem.courseId);

      if (!existing) {
        return [...items, { ...cartItem, quantity: 1 }];
      }

      return items.map(i =>
        i.courseId === cartItem.courseId
          ? { ...cartItem }
          : i
      );
    });
  }
}

