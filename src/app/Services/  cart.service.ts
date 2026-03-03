import { computed, effect, inject, Injectable, signal, } from '@angular/core';
import { APICartItem, APICartResponse, APICheckout, CartItem, UpdateCartItem } from '../models/cart';
import ApiService from '../shared/Services/ApiService/api.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

type ReservationKey =
  | 'examSimulationReserv'
  | 'recordedCourseReserv'
  | 'liveCourseReserv';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private auth = inject(AuthService);
  studentId = computed(() => this.auth.loggedStudent()?.userId);
  cartItems = signal<APICartItem[]>([]);
  currentBasketId=signal<string>('');
  cartCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  appliedCoupon = signal<string | null>(null);
  discountAmount = signal<number>(0);

  subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.finalPrice ?? 0), 0)
  );

  total = computed(() =>
    this.subtotal() - this.discountAmount()
  );

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
        },
        error: (err) => {
          console.error('Failed to load basket', err);
          this.cartItems.set([]);
        }
      });

    });
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
    const url =`StudentBaskets/${this.studentId()!}/checkout`
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

  addCoupon(body: { "couponCode": "string" }): Observable<APICheckout> {
    const url = `StudentBaskets/${this.currentBasketId()}/coupon`
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
      .delete<ApiResponse<boolean>>('StudentBaskets', id)
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
  courseExists( courseId: string): boolean {
    return !!this.getCourse( courseId);
  }

  isInCart(
    courseId: string,
    key: ReservationKey
  ): boolean {

    const course = this.getCourse( courseId);

    return !!course?.[key];
  }

  updateBasket(cartItem: APICartItem) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.courseId === cartItem.courseId);

      if (!existing) {
        return [...items, { ...cartItem, quantity: 1 }];
      }

      return items.map(i =>
        i.courseId === cartItem.courseId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    });
  }

}

