export interface CartItem {
  studentId: string,
  courseId: string,
  couponCode: string,
  examSimulationReserv: boolean,
  recordedCourseReserv: boolean,
  liveCourseReserv: boolean,
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
  examSimulationReserv: boolean,
  recordedCourseReserv: boolean,
  liveCourseReserv: boolean,
}

export interface UpdateCartItem {

  oid: string,
  quantity: number,
  couponCode: string
  examSimulationReserv: boolean,
  recordedCourseReserv: boolean,
  liveCourseReserv: boolean,
}

export interface APICheckout {
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
  certificateNumber: string,
  examSimulationReserv: boolean,
  recordedCourseReserv: boolean,
  liveCourseReserv: boolean,
}

export interface APICouponData {
  items: APICartItem[];
  subTotal: number;
  totalDiscount: number;
  total: number;
  itemCount: number;
}

export interface APICartResponse {
  items: APICartItem[];
}
