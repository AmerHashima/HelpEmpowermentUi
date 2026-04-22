export interface Webinar{
  oid?:string,
  courseOid:string,
  webinarName: string,
  webinarFormat: string,
  webinarDate: string,
  webinarStartTime: string,
  webinarEndTime: string,
  timeZone: string,
  whatsAppLink: string,
  notes: string,
  isActive: boolean,
  createdBy:string
}

export interface ApiWebinar {
  oid:string,
  courseOid:string,
  courseName:string,
  webinarName: string,
  webinarFormat: string,
  webinarDate: string,
  webinarStartTime: string,
  webinarEndTime: string,
  timeZone: string,
  whatsAppLink: string,
  notes: string,
  isActive: true,
  createdAt: string,
  createdBy:string,
  updatedAt: string,
  updatedBy:string
}
