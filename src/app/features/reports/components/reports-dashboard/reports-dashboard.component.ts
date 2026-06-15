import { Component } from '@angular/core';
import { MonthlyReportComponent } from '../monthly-report/monthly-report.component';
import { WeeklyReportComponent } from '../weekly-report/weekly-report.component';
import { DailyReportComponent } from '../daily-report/daily-report.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MonthlyDetailedReportComponent } from '../monthly-detailed-report/monthly-detailed-report.component';

@Component({
  selector: 'pos-reports-dashboard',
  imports: [MatTabsModule, DailyReportComponent, WeeklyReportComponent, MonthlyReportComponent, MonthlyDetailedReportComponent],
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.scss'
})
export class ReportsDashboardComponent {

}
