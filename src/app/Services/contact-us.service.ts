import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APIContact, ContactUs, MarkAsReadRequest, RespondContactUsDto, UpdateStatusRequest } from '../models/contact-us';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { RequestBody } from '../models/rquest';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private apiService: ApiService) { }

  // POST /api/ServiceContactUs/search
  search(body: RequestBody): Observable<APIContact[]> {
    return this.apiService
      .query<ApiSearchResponse<APIContact>>('ServiceContactUs/search', body)
      .pipe(map(res => res.data));
  }

  // GET /api/ServiceContactUs/{id}
  getById(id: string): Observable<APIContact> {
    return this.apiService
      .get<ApiResponse<APIContact>>(`ServiceContactUs/${id}`)
      .pipe(map(res => res.data));
  }

  // DELETE /api/ServiceContactUs/{id}
  deleteContact(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('ServiceContactUs', id)
      .pipe(map(res => res.data));
  }

  // GET /api/ServiceContactUs/ticket/{ticketNumber}
  getByTicket(ticketNumber: string): Observable<APIContact> {
    return this.apiService
      .get<ApiResponse<APIContact>>(`ServiceContactUs/ticket/${ticketNumber}`)
      .pipe(map(res => res.data));
  }

  // GET /api/ServiceContactUs/student/{studentId}
  getByStudent(studentId: string): Observable<APIContact[]> {
    return this.apiService
      .get<ApiResponse<APIContact[]>>(`ServiceContactUs/student/${studentId}`)
      .pipe(map(res => res.data));
  }

  // GET /api/ServiceContactUs/unread
  getUnread(): Observable<APIContact[]> {
    return this.apiService
      .get<ApiResponse<APIContact[]>>('ServiceContactUs/unread')
      .pipe(map(res => res.data));
  }

  // GET /api/ServiceContactUs/unread/count
  getUnreadCount(): Observable<number> {
    return this.apiService
      .get<ApiResponse<number>>('ServiceContactUs/unread/count')
      .pipe(map(res => res.data));
  }

  // POST /api/ServiceContactUs
  createContactMessage(body: ContactUs,page:string=''): Observable<APIContact> {
    return this.apiService
      .post<ApiResponse<APIContact>>('ServiceContactUs', body, 'Message has been sent Successfully',page)
      .pipe(map(res => res.data));
  }

  // POST /api/ServiceContactUs/{id}/respond
  respond(id: string, body: RespondContactUsDto): Observable<APIContact> {
    return this.apiService
      .post<ApiResponse<APIContact>>(`ServiceContactUs/${id}/respond`, body, '')
      .pipe(map(res => res.data));
  }

  // PUT /api/ServiceContactUs/{id}/read
  markAsRead(id: string, body: MarkAsReadRequest): Observable<boolean> {
    return this.apiService
      .put<ApiResponse<boolean>>(`ServiceContactUs/${id}/read`, '', body, '')
      .pipe(map(res => res.data));
  }

  // PUT /api/ServiceContactUs/{id}/status
  updateStatus(id: string, body: UpdateStatusRequest): Observable<boolean> {
    return this.apiService
      .put<ApiResponse<boolean>>(`ServiceContactUs/${id}/status`, '', body, '')
      .pipe(map(res => res.data));
  }
}

