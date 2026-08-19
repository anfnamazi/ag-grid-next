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
    id: 3,
    requestNumber: 3,
    requester: "مدیر ارشد",
    createdAt: "۱۴۰۵/۰۵/۲۸ ۰۹:۱۹:۴۱",
    subject: "asgda",
    description: "asg",
    showDate: "۱۴۰۵/۰۵/۲۸",
    showTime: "12:12",
    showPlace: "as",
    keywords: "asg",
    notes: "ag",
    status: "ثبت اولیه",
  },
  {
    id: 1,
    requestNumber: 1,
    requester: "مدیر ارشد",
    createdAt: "۱۴۰۵/۰۵/۲۷ ۱۵:۳۰:۵۰",
    subject: "sdag",
    description: "sagdsad",
    showDate: "۱۴۰۵/۰۵/۲۷",
    showTime: "asdg",
    showPlace: "",
    keywords: "asg",
    notes: "asg",
    status: "محتوا تولید شد",
  },
  {
    id: 2,
    requestNumber: 2,
    requester: "مدیر ارشد",
    createdAt: "۱۴۰۵/۰۵/۲۷ ۱۶:۲۸:۴۴",
    subject: "sadg",
    description: "asgd",
    showDate: "۱۴۰۵/۰۵/۲۷",
    showTime: "12:00",
    showPlace: "sagd",
    keywords: "asg",
    notes: "asgd",
    status: "بارگذاری شد",
  },
];
