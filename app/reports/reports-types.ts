export type ReportStatus =
  | "ثبت اولیه"
  | "درحال بررسی"
  | "در حال تولید محتوا"
  | "محتوا تولید شد"
  | "کل محتوا تایید شد"
  | "بارگذاری شد"
  | "محتوای بارگذاری شده چک شد";

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
