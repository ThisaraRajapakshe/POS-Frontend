import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdminDashboardDto } from '../models/adminDashboardDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/DashBoards`;
  private httpClient = inject(HttpClient);

  getAdminDashboardData() : Observable<AdminDashboardDto> {
    return this.httpClient.get<AdminDashboardDto>(`${this.baseUrl}/Admin`);
  }
}
