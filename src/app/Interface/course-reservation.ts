export interface CourseReservation {
  studentCourseId: string
  courseServiceId: string,
  reservationDate: string,
  servicePrice: number,
  isReserved: boolean,
  notes: string,
  createdBy: string
}

export interface APICourseReservation {
  oid:string,
  studentCourseId: string
  studentId: string | null,
  courseId: string | null,
  courseServiceId: string,
  reservationDate: string | null,
  servicePrice: number | null,
  isReserved: boolean,
  notes: string | null,
  createdBy: string | null,
  courseName: string | null,
  serviceName: string | null,
  reservationExpiryDate:string | null,
  activeTime: number | null,
  createdAt: string | null,
  updatedAt: string | null
  updatedBy: string | null
}

export interface UpdateCourseReservation {
  oid: string,
  courseServiceId: string,
  reservationDate: string,
  isReserved: boolean,
  notes: string,
  updatedBy: string
}

