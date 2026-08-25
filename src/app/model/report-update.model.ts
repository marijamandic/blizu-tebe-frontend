import { ReportStatus } from "./report.model";

export interface ReportUpdate{
    id: number;
    status: ReportStatus;
}