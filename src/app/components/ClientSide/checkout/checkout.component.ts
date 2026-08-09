import { Component, DestroyRef, effect, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/input/input.component';
import { NgIf } from '@angular/common';
import { PhoneInputComponent } from '../../../shared/phone/phone.component';
import { CartService } from '../../../Services/  cart.service';
import { StudentService } from '../../../Services/student-service.service';
import { CheckoutService } from '../../../Services/checkout-service.service';
import { LookupService } from '../../../Services/lookup.service';
import { LookupDetail } from '../../../models/lookup';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { EMPTY, Subject, catchError, exhaustMap, finalize, tap } from 'rxjs';
import { TelrPaymentService } from '../../../Services/telr-payment.service';
import { ApiProblemDetails } from '../../../models/telr-payment';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';
import { SpkNgSelectComponent } from '../../../shared/spk-ng-select/spk-ng-select.component';
import { City } from 'country-state-city';

interface CityOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-checkout',
  imports: [InputComponent,NgIf,ReactiveFormsModule,PhoneInputComponent,TranslatePipe,SpkNgSelectComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
 private cartService=inject(CartService);
 private shared=inject(Shared);
 private router =inject(Router);
 private route=inject(ActivatedRoute);
 private studentService=inject(StudentService);
 private checkoutService = inject(CheckoutService);
 private lookUpService=inject(LookupService);
 private telrPayment = inject(TelrPaymentService);
 private toasting = inject(ToastingMessagesService);
 private destroyRef = inject(DestroyRef);
 private cardCheckout = new Subject<void>();
 student = this.studentService.innerStudent;
isRTL = this.shared.isRtl;
  // paymentMethods: LookupDetail[]=[];
 paymentMethods$=this.lookUpService.getPaymentMethods();
 paymentMethods: LookupDetail[] = [];
 cities: CityOption[] = [];
 @ViewChildren(PhoneInputComponent)
 phoneCmps!: QueryList<PhoneInputComponent>;
 cartItems=this.cartService.cartItems;
 discontAmount=this.cartService.discountAmount;
 subTotal=this.cartService.subtotal;
 total = this.cartService.total;
 private fb = inject(FormBuilder);
 loading = signal(false);
 paymentError = signal('');

 checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    paymentMethod: ['card', Validators.required],
    // acceptTerms: [false, Validators.requiredTrue]
  });

  constructor() {

    this.loadCities('SA', false);

    this.cardCheckout.pipe(
      exhaustMap(() => this.startTelrCheckout()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    // this.loadPaymentMethods();

    effect(() => {

      const student = this.student();

      if (!student) return;

      this.checkoutForm.patchValue({

        fullName: student.nameEn,

        email: student.email,

        // phone: student.mobile

      });

    });

  }

  ngOnInit() {

    this.paymentMethods$

      .subscribe(methods => {

        this.paymentMethods = methods ?? [];

      });
  }

  placeOrder() {

    if (this.loading()) return;

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      this.phoneCmps?.forEach(
        c => c.validateOnSubmit()
      );

      return;

    }

    const paymentMethodId =
      this.checkoutForm.value.paymentMethod;

    const selectedMethod =
      this.paymentMethods.find(
        x => x.oid === paymentMethodId
      );

    switch (selectedMethod?.lookupValue) {

      case 'Card':
        this.continueWithCreditOrCard();
        break;

      case 'Paypal':
        this.loading.set(true);
        this.continueWithPaypal();
        break;

      case 'Cash':
        this.loading.set(true);
        this.reserveCourse();
        break;

      default:
        this.loading.set(false);
        break;

    }

  }

  continueWithPaypal(){
    this.reserveCourse();
  }

  continueWithCreditOrCard() {
    this.cardCheckout.next();
  }

  // reserveCourse(){
  //   const checkoutPayload={
  //     paymentMethod:this.checkoutForm.value.paymentMethod!,
  //     couponCode: this.cartService.appliedCoupon() ?? ''

  //   }
  //   this.cartService.chekout(checkoutPayload).subscribe({

  //     next: () => {

  //       this.loading.set(false);
  //       this.cartService.cartCheckedItems.set([...this.cartService.cartItems()]);
  //       this.cartItems.set([]);
  //       this.router.navigate(['../invoice/'], {

  //         relativeTo: this.route,

  //       });

  //     },

  //     error: (err) => {

  //       this.loading.set(false);

  //       console.error(err);

  //     }

  //   });
  // }



  reserveCourse(){
    this.checkoutService
      .checkout(

        this.cartItems(),
        this.checkoutForm.value.paymentMethod!

      )

      .subscribe({

        next: () => {

          this.loading.set(false);
          this.cartService.cartCheckedItems.set([...this.cartService.cartItems()]);
          this.cartItems.set([]);
          this.router.navigate(['../invoice/' ], {

            relativeTo: this.route,

          });

        },

        error: (err) => {

          this.loading.set(false);

          console.error(err);

        }

      });
  }

  onPhoneCountryChange(countryCode: string): void {
    this.loadCities(countryCode, true);
  }

  private loadCities(countryCode: string, clearSelection: boolean): void {
    this.cities = (City.getCitiesOfCountry(countryCode) ?? [])
      .map(city => ({
        label: city.stateCode ? `${city.name} (${city.stateCode})` : city.name,
        value: city.name
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    if (clearSelection) {
      this.checkoutForm.controls.city.reset('');
    }
  }

  private startTelrCheckout() {
    this.loading.set(true);
    this.paymentError.set('');
    const couponCode = this.cartService.appliedCoupon()?.trim() || null;

    return this.telrPayment.checkout(couponCode).pipe(
      tap(response => {
        this.telrPayment.savePending(response.payment.paymentId, response.invoiceId);
        window.location.assign(response.payment.paymentUrl);
      }),
      catchError(error => {
        const problem = error as ApiProblemDetails;
        const message = this.checkoutErrorMessage(problem);
        this.paymentError.set(message);
        this.toasting.error(message);
        if (problem.status === 401) {
          this.router.navigate([`/${this.shared.lang()}/auth/login`], { queryParams: { returnUrl: this.router.url } });
        }
        return EMPTY;
      }),
      finalize(() => this.loading.set(false))
    );
  }

  private checkoutErrorMessage(problem: ApiProblemDetails): string {
    const messages: Record<string, string> = {
      BASKET_EMPTY: 'Your basket is empty.', INVALID_COUPON: 'The selected coupon is invalid or expired.',
      INVALID_BASKET: 'Your basket could not be validated.', INVALID_CHECKOUT_TOTAL: 'The checkout total is invalid.',
      UNSUPPORTED_CURRENCY: 'This currency is not supported.', INVALID_PAYMENT_URL: 'The secure payment address is invalid.'
    };
    if (problem.status === 503) return 'The payment gateway is temporarily unavailable. Please try again later.';
    if (problem.errorCode && messages[problem.errorCode]) return messages[problem.errorCode];
    const detail = problem.detail?.trim();
    return detail && detail.length <= 300 && !/[<>\r\n]|stack|exception/i.test(detail)
      ? detail : 'Unable to prepare the secure payment. Please try again.';
  }


}
