import { DailyReport } from "./DailyReport";
import { ReportSummary } from "./ReportSummary";

export interface MonthlyReport {
  year: number;
  month: number;
  monthlySummary: ReportSummary;   // aggregated total
  dailyReports: DailyReport[];     // array of daily details (DailyReportDto)
}