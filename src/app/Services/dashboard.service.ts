import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { AssignedDashboard } from '../models/assigned-dashboard';
import ApiService from '../shared/Services/ApiService/api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}
  getMine(): Observable<AssignedDashboard> {
    return this.api.get<ApiResponse<AssignedDashboard>>('me/dashboard').pipe(map(response => {
      if (!response.success) throw new Error(response.message || 'Unable to load dashboard');
      return response.data;
    }));
  }
}
