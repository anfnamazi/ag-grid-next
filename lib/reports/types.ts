export type ReportStatus =
  | "initial"
  | "review"
  | "producing"
  | "produced"
  | "approved"
  | "uploaded"
  | "checked";

export type ReportRow = {
  id: number;
  requestNumber: number;
  requester: string;
  createdAt: string;
  subject: string;
  description: string;
  showDate: string;
  showTime: string;
  showPlace: string;
  keywords: string;
  notes: string;
  status: ReportStatus;
};

export type ReportsResponse = {
  data: ReportRow[];
  total: number;
  pageNumber: number;
  pageSize: number;
};
