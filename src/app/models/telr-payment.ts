export enum PaymentStatus {
  Created = 'Created', Pending = 'Pending', Redirected = 'Redirected',
  Authorised = 'Authorised', OnHold = 'OnHold', Declined = 'Declined',
  Cancelled = 'Cancelled', Failed = 'Failed', Expired = 'Expired', Refunded = 'Refunded'
}

export interface TelrCheckoutResponse {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  payment: {
    paymentId: string;
    cartId: string;
    telrOrderReference: string;
    paymentUrl: string;
    status: PaymentStatus;
  };
}

export interface PaymentStatusResponse {
  paymentId: string; invoiceId: string; invoiceNumber: string;
  status: PaymentStatus; isPaid: boolean; amount: number; currency: string;
  transactionReference?: string; authCode?: string; authMessage?: string; paidAt?: string;
}

export interface ApiProblemDetails {
  status?: number; detail?: string; title?: string; errorCode?: string;
  errors?: Record<string, string[]>;
}
