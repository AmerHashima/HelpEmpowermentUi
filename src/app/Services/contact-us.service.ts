import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APIContact, ContactUs } from '../models/contact-us';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private apiService:ApiService) { }
  createContactMessage(body: ContactUs): Observable<APIContact> {
          return this.apiService
            .post<ApiResponse<APIContact>>('ServiceContactUs', body,"Message has been sent Successfully")
            .pipe(
              map((response: ApiResponse<APIContact>) => {
                if (!response.success) {
                  const msg = response.errors?.join(', ') || response.message || 'API failed to send message';
                  throw new Error(msg);
                }
                return response.data;
              })
            );
        }
}
