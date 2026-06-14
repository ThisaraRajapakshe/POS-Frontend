import { ReportSummary } from "./ReportSummary";
import { TopSellingItem } from "./TopSellingItem";

export interface DailyReport {
  date: Date;
  summary: ReportSummary;
  topSellingItems: TopSellingItem[];
}