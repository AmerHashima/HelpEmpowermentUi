export interface CartItem {
  studentId: string,
  courseId: string,
  couponCode: string,
}

export interface APICartItem {
  oid: string,
  studentId: string,
  studentName: string,
  courseId: string,
  courseName: string,
  courseImage: string,
  originalPrice: number,
  discountAmount: number,
  finalPrice: number,
  couponCode: string,
  quantity: number,
  addedAt: string
}

export interface UpdateCartItem {

  oid: string,
  quantity: number,
  couponCode: string
}

export interface APICheckout{
  oid: string,
  studentId: string,
  studentName: string,
  courseId: string,
  courseName: string,
  paymentStatusLookupId: string,
  paymentStatusName: string,
  price: number,
  discountAmount: number,
  paidAmount: number,
  paymentMethod: string,
  transactionId: string,
  paymentDate: string,
  enrollmentStatusLookupId: string,
  enrollmentStatusName: string,
  enrollmentDate: string,
  expiryDate: string,
  completedDate: string,
  progressPercentage: number,
  completedLessons: number,
  totalLessons: number,
  isCertificateIssued: boolean,
  certificateIssuedDate: string,
  certificateNumber: string
}

export interface APICartResponse {
  items: APICartItem[];
}
