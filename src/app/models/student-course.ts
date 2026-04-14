// src\app\models\student-course.ts
export interface APIStudentCourse {
  oid: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  paymentStatusLookupId: string | null;
  paymentStatusName: string | null;
  price: number;
  discountAmount: number;
  paidAmount: number | null;
  paymentMethod: string | null;
  transactionId: string | null;
  paymentDate: string | null;
  enrollmentStatusLookupId: string | null;
  enrollmentStatusName: string | null;
  enrollmentDate: string | null;
  expiryDate: string | null;
  completedDate: string | null;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  examSimulationReserv: boolean;
  recordedCourseReserv: boolean;
  liveCourseReserv: boolean;
  isCertificateIssued: boolean;
  certificateIssuedDate: string | null;
  certificateNumber: string | null;
}


export interface StudentCourse {
  studentId: string,
  courseId: string,
  price: number,
  examSimulationReserv: boolean,
  recordedCourseReserv: boolean,
  liveCourseReserv: boolean,
  discountAmount: number,
  paymentMethod: string,
  createdBy: string
}

export interface updateStudentCourse {
  oid: string,
  paymentStatusLookupId: string | null,
  paidAmount: number,
  transactionId: string | null,
  paymentDate: string | null,
  examSimulationReserv: boolean,
  recordedCourseReserv: boolean,
  liveCourseReserv: boolean,
  enrollmentStatusLookupId: string | null,
  progressPercentage: number,
  completedLessons: number,
  updatedBy: string
}

