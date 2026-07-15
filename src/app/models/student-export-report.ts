export type StudentExportSortField = 'nameEn' | 'email' | 'isActive' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface StudentExportFilter {
  propertyName: 'nameEn' | 'email' | 'isActive';
  value: string;
  operation: 0 | 2;
}

export interface StudentExportSearchRequest {
  filters: StudentExportFilter[];
  sort: Array<{ sortBy: StudentExportSortField; sortDirection: SortDirection }>;
  pagination: { getAll: boolean; pageNumber: number; pageSize: number };
  columns: string[];
}

export interface StudentExportReservation {
  reservationId: string;
  courseServiceId: string;
  serviceName: string;
  reservationDate: string;
  reservationExpiryDate: string;
  isReserved: boolean;
  servicePrice: number;
  addedBy: string;
}

export interface StudentExportCourse {
  studentCourseId: string;
  courseId: string;
  courseName: string;
  paymentStatusName: string | null;
  paidAmount: number | null;
  enrollmentStatusName: string | null;
  enrollmentDate: string | null;
  expiryDate: string | null;
  reservations: StudentExportReservation[];
}

export interface StudentExportReport {
  studentId: string;
  nameEn: string;
  nameAr: string;
  email: string;
  mobile: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  promoCode: string | null;
  promoDiscount: number | null;
  promoValidTo: string | null;
  numberOfPeopleUsedPromo: number;
  totalMoneyWithPromo: number;
  courses: StudentExportCourse[];
}

export interface PaginatedStudentExportResponse {
  success: boolean;
  message: string | null;
  errors: string[];
  data: StudentExportReport[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
