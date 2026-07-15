export interface ContactUs {
  fullName: string,
  fullNameAr: string,
  email: string,
  phone: string,
  mobile: string,
  subject: string,
  subjectAr: string,
  message: string,
  messageAr: string,
  contactTypeLookupId: string,
  studentId: string
}


export interface APIContact {
  oid: string,
  fullName: string,
  fullNameAr: string,
  email: string,
  phone: string,
  mobile: string,
  subject: string,
  subjectAr: string,
  message: string,
  messageAr: string,
  contactTypeLookupId: string,
  contactTypeName: string,
  priorityLookupId: string,
  priorityName: string,
  statusLookupId: string,
  statusName: string,
  response: string,
  respondedAt: string | null,
  ticketNumber: string,
  isRead: boolean,
  readAt: string | null,
  createdAt: string
}

export interface RespondContactUsDto {
  response: string;
}

export interface MarkAsReadRequest {
  isRead: boolean;
}

export interface UpdateStatusRequest {
  statusLookupId: string;
}
