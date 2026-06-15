import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyReport, MonthlyReport, ReportSummary } from '../models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Reports`;

  // Get user's local IANA time zone
  private userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


    getDailyReport(date: string): Observable<DailyReport> {
    const params = new HttpParams()
    .set('date', date)
    .set('timeZoneId', this.userTimeZone);
    return this.http.get<DailyReport>(`${this.baseUrl}/daily`, { params });
  }
  getWeeklyReport(weekStart: string): Observable<DailyReport[]> {
    const params = new HttpParams()
      .set('weekStart', weekStart)
      .set('timeZoneId', this.userTimeZone);
    return this.http.get<DailyReport[]>(`${this.baseUrl}/weekly`, { params });
  }

  getMonthlyReport(year: number, month: number): Observable<ReportSummary> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
      .set('timeZoneId', this.userTimeZone);
    return this.http.get<ReportSummary>(`${this.baseUrl}/monthly`, { params });
  }
}
