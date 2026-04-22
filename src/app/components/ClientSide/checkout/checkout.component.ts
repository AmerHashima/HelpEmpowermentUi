import { Component, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/input/input.component';
import { NgIf } from '@angular/common';
import { PhoneInputComponent } from '../../../shared/phone/phone.component';
import { CartService } from '../../../Services/  cart.service';

@Component({
  selector: 'app-checkout',
  imports: [InputComponent,NgIf,ReactiveFormsModule,PhoneInputComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private cartService=inject(CartService);
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
    acceptTerms: [false, Validators.requiredTrue]
  });


  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.phoneCmps?.forEach(c => c.validateOnSubmit());
      return;
    }

    this.loading.set(true);

    const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;

    if (paymentMethod == 'card'){
      this.continueWithCreditOrCard()
    } else if (paymentMethod == 'paypal'){
       this.continueWithPaypal();
    }
    // setTimeout(() => {
    //   this.loading.set(false);
    //   console.log(this.checkoutForm.value);
    // }, 1500);
  }

  continueWithPaypal(){}
  continueWithCreditOrCard() { }

}
