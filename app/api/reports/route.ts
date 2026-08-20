import type { ReportRow, ReportsResponse } from "@/app/reports/reports-types";

const reports: ReportRow[] = [
  {
    id: 1,
    requestNumber: 1,
    requester: "مدیر ارشد",
    createdAt: "2026-08-18T12:00:50.000Z",
    subject: "موضوع گزارش 1",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    showDate: "2026-08-18T00:00:00.000Z",
    showTime: "18:30",
    showPlace: "",
    keywords: "keyword1, keyword2",
    notes: "موضوعات مرتبط با گزارش 1",
    status: "محتوا تولید شد",
  },
  {
    id: 2,
    requestNumber: 2,
    requester: "کاربر عادی",
    createdAt: "2026-08-19T12:00:50.000Z",
    subject: "موضوع گزارش 2",
    description: "لورم ایپسوم.",
    showDate: "2026-08-19T00:00:00.000Z",
    showTime: "19:30",
    showPlace: "",
    keywords: "keyword3, keyword4",
    notes: "موضوعات مرتبط با گزارش 2",
    status: "در حال تولید محتوا",
  },
  {
    id: 3,
    requestNumber: 3,
    requester: "کاربر عادی",
    createdAt: "2026-08-20T12:00:50.000Z",
    subject: "موضوع گزارش 3",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    showDate: "2026-08-20T00:00:00.000Z",
    showTime: "20:30",
    showPlace: "",
    keywords: "keyword5, keyword6",
    notes: "موضوعات مرتبط با گزارش 3",
    status: "ثبت اولیه",
  },
  {
    id: 4,
    requestNumber: 4,
    requester: "کاربر عادی",
    createdAt: "2026-08-21T12:00:50.000Z",
    subject: "موضوع گزارش 4",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    showDate: "2026-08-21T00:00:00.000Z",
    showTime: "21:30",
    showPlace: "",
    keywords: "keyword7, keyword8",
    notes: "موضوعات مرتبط با گزارش 4",
    status: "درحال بررسی",
  },
  {
    id: 5,
    requestNumber: 5,
    requester: "کاربر عادی",
    createdAt: "2026-08-22T12:00:50.000Z",
    subject: "موضوع گزارش 5",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    showDate: "2026-08-22T00:00:00.000Z",
    showTime: "22:30",
    showPlace: "",
    keywords: "keyword9, keyword10",
    notes: "موضوعات مرتبط با گزارش 5",
    status: "محتوا تولید شد",
  },
  {
    id: 6,
    requestNumber: 6,
    requester: "کاربر عادی",
    createdAt: "2026-08-23T12:00:50.000Z",
    subject: "موضوع گزارش 6",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    showDate: "2026-08-23T00:00:00.000Z",
    showTime: "23:30",
    showPlace: "",
    keywords: "keyword11, keyword12",
    notes: "موضوعات مرتبط با گزارش 6",
    status: "ثبت اولیه",
  },
];

export async function GET() {
  const response: ReportsResponse = { data: reports };

  return Response.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
