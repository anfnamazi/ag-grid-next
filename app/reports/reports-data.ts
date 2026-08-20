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

// داده‌های JSON تبدیل‌شده از CSV ارائه‌شده.
export const reportRows: ReportRow[] = [
  {
    id: 1,
    requestNumber: 1,
    requester: "مدیر ارشد",
    createdAt: "2026-08-18T12:00:50.000Z",
    subject: "sdag",
    description: "sagdsadasgdsa sdagsag asdgsagdas gsadg sagsa dgas gasgdas",
    showDate: "2026-08-18T00:00:00.000Z",
    showTime: "18:30",
    showPlace: "",
    keywords: "asg",
    notes: "asg",
    status: "محتوا تولید شد",
  },
  {
    id: 2,
    requestNumber: 2,
    requester: "مدیر ارشد",
    createdAt: "2026-08-18T12:58:44.000Z",
    subject: "sadg",
    description: "asgd",
    showDate: "2026-08-18T00:00:00.000Z",
    showTime: "12:00",
    showPlace: "sagd",
    keywords: "asg",
    notes: "asgd",
    status: "بارگذاری شد",
  },
  {
    id: 3,
    requestNumber: 3,
    requester: "مدیر ارشد",
    createdAt: "2026-08-19T05:49:41.000Z",
    subject: "asgda",
    description: "asg",
    showDate: "2026-08-19T00:00:00.000Z",
    showTime: "12:12",
    showPlace: "as",
    keywords: "asg",
    notes: "ag",
    status: "ثبت اولیه",
  },
];
