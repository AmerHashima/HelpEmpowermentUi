import { Component, effect, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/input/input.component';
import { NgIf } from '@angular/common';
import { PhoneInputComponent } from '../../../shared/phone/phone.component';
import { CartService } from '../../../Services/  cart.service';
import { StudentService } from '../../../Services/student-service.service';
import { CheckoutService } from '../../../Services/checkout-service.service';
import { LookupService } from '../../../Services/lookup.service';
import { LookupDetail } from '../../../models/lookup';

@Component({
  selector: 'app-checkout',
  imports: [InputComponent,NgIf,ReactiveFormsModule,PhoneInputComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
 private cartService=inject(CartService);
 private studentService=inject(StudentService);
 private checkoutService = inject(CheckoutService);
 private lookUpService=inject(LookupService);
 student = this.studentService.innerStudent;
  // paymentMethods: LookupDetail[]=[];
 paymentMethods$=this.lookUpService.getPaymentMethods();
 paymentMethods: LookupDetail[] = [];
 @ViewChildren(PhoneInputComponent)
 phoneCmps!: QueryList<PhoneInputComponent>;
 cartItems=this.cartService.cartItems;
 discontAmount=this.cartService.discountAmount;
 subTotal=this.cartService.subtotal;
 total = this.cartService.total;
 private fb = inject(FormBuilder);
 loading = signal(false);

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

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      this.phoneCmps?.forEach(
        c => c.validateOnSubmit()
      );

      return;

    }

    this.loading.set(true);

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
        this.continueWithPaypal();
        break;

      case 'Cash':
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
    this.reserveCourse();
  }

  reserveCourse(){
    this.checkoutService
      .checkout(

        this.cartItems(),
        this.checkoutForm.value.paymentMethod!

      )

      .subscribe({

        next: () => {

          this.loading.set(false);

          console.log('Checkout completed');

        },

        error: (err) => {

          this.loading.set(false);

          console.error(err);

        }

      });
  }


}
