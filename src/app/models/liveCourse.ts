export interface LiveCourse {
  oid?: string,
  courseName: string,
  courseOid: string,
  courseFormat: string,
  startDate: string,
  startTime: string,
  timeZone: string,
  numberOfSessions: number,
  totalHours: number,
  scheduleNotes: string,
  whatsAppLink: string,
  notes: string,
  isActive: boolean,
  createdBy: string
}

export interface APILiveCourse {
  oid: string,
  courseOid: string,
  courseRefName: string,
  courseName: string,
  courseFormat: string,
  startDate: string,
  startTime: string,
  timeZone: string,
  numberOfSessions: number,
  totalHours: number,
  scheduleNotes: string,
  whatsAppLink: string,
  notes: string,
  isActive: boolean,
  createdBy: string
  createdAt: string,
  updatedAt: string | null,
  updatedBy: string | null
}

