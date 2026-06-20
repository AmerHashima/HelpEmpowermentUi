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
  courseServiceId: string,
  reservationDate: string,
  servicePrice: number,
  isReserved: boolean,
  notes: string,
  createdBy: string,
  courseName: string,
  serviceName: string,
  reservationExpiryDate:string,
  activeTime: number,
  createdAt: string,
  updatedAt: string
  updatedBy: string
}

export interface UpdateCourseReservation {
  oid: string,
  courseServiceId: string,
  reservationDate: string,
  isReserved: boolean,
  notes: string,
  updatedBy: string
}

