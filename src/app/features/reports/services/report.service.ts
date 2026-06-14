import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyReport } from '../models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Reports`;
    getDailyReport(date: string): Observable<DailyReport> {
    const params = new HttpParams().set('date', date);
    return this.http.get<DailyReport>(`${this.baseUrl}/daily`, { params });
  }
  //TODO: Add the report fetching methods weekly and monthly.
}
