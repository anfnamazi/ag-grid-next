import type { ReportRow, ReportsResponse } from "@/app/reports/reports-types";
import type { NextRequest } from "next/server";

type ApiFilterModel = {
  filterType?: "text" | "number" | "date";
  type?: string;
  filter?: string | number;
  filterTo?: number;
  dateFrom?: string;
  dateTo?: string | null;
  operator?: "AND" | "OR";
  conditions?: ApiFilterModel[];
};

type ApiSortModel = {
  colId: string;
  sort: "asc" | "desc";
};

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
    status: "produced",
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
    status: "producing",
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
    status: "initial",
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
    status: "review",
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
    status: "produced",
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
    status: "initial",
  },
];

const sortableFields: Record<string, keyof ReportRow> = {
  id: "id",
  requestNumber: "requestNumber",
  requester: "requester",
  createdAt: "createdAt",
  subject: "subject",
  description: "description",
  showDate: "showDate",
  showTime: "showTime",
  showPlace: "showPlace",
  status: "status",
};

const parseJson = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const compare = (left: number | string, right: number | string) =>
  left === right ? 0 : left < right ? -1 : 1;

const matchesCondition = (
  value: ReportRow[keyof ReportRow],
  model: ApiFilterModel,
): boolean => {
  if (model.conditions?.length) {
    const matches: boolean[] = model.conditions.map((condition) =>
      matchesCondition(value, condition),
    );
    return model.operator === "OR" ? matches.some(Boolean) : matches.every(Boolean);
  }

  const type = model.type ?? "contains";
  const isBlank = value === null || value === undefined || String(value).trim() === "";
  if (type === "blank") return isBlank;
  if (type === "notBlank") return !isBlank;

  if (model.filterType === "date") {
    const cellDate = String(value).slice(0, 10);
    const dateFrom = model.dateFrom?.slice(0, 10) ?? "";
    const dateTo = model.dateTo?.slice(0, 10) ?? dateFrom;
    if (!dateFrom) return true;

    if (type === "inRange") return cellDate >= dateFrom && cellDate <= dateTo;
    if (type === "greaterThan" || type === "greaterThanOrEqual") {
      return type === "greaterThan" ? cellDate > dateFrom : cellDate >= dateFrom;
    }
    if (type === "lessThan" || type === "lessThanOrEqual") {
      return type === "lessThan" ? cellDate < dateFrom : cellDate <= dateFrom;
    }
    if (type === "notEqual") return cellDate !== dateFrom;
    return cellDate === dateFrom;
  }

  if (model.filterType === "number") {
    const cellNumber = Number(value);
    const filter = Number(model.filter);
    const filterTo = Number(model.filterTo ?? model.filter);
    if (!Number.isFinite(filter)) return true;

    if (type === "inRange") return cellNumber >= filter && cellNumber <= filterTo;
    if (type === "greaterThan") return cellNumber > filter;
    if (type === "greaterThanOrEqual") return cellNumber >= filter;
    if (type === "lessThan") return cellNumber < filter;
    if (type === "lessThanOrEqual") return cellNumber <= filter;
    if (type === "notEqual") return cellNumber !== filter;
    return cellNumber === filter;
  }

  const cellText = String(value).toLocaleLowerCase();
  const filterText = String(model.filter ?? "").toLocaleLowerCase();
  if (!filterText) return true;
  if (type === "equals") return cellText === filterText;
  if (type === "notEqual") return cellText !== filterText;
  if (type === "notContains") return !cellText.includes(filterText);
  if (type === "startsWith") return cellText.startsWith(filterText);
  if (type === "endsWith") return cellText.endsWith(filterText);
  return cellText.includes(filterText);
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const pageNumber = Math.max(1, Number(params.get("pageNumber")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize")) || 5));
  const filterModel = parseJson<Record<string, ApiFilterModel>>(
    params.get("filter"),
    {},
  );
  const sortModel = parseJson<ApiSortModel[]>(params.get("sort"), []);
  const search = (params.get("search") ?? "").trim().toLocaleLowerCase();

  let filteredReports = reports.filter((report) => {
    const matchesSearch =
      !search ||
      Object.values(report).some((value) =>
        String(value).toLocaleLowerCase().includes(search),
      );
    if (!matchesSearch) return false;

    return Object.entries(filterModel).every(([columnId, model]) => {
      const field = sortableFields[columnId];
      return field ? matchesCondition(report[field], model) : true;
    });
  });

  if (sortModel.length) {
    filteredReports = [...filteredReports].sort((first, second) => {
      for (const sort of sortModel) {
        const field = sortableFields[sort.colId];
        if (!field) continue;
        const result = compare(first[field], second[field]);
        if (result !== 0) return sort.sort === "desc" ? -result : result;
      }
      return 0;
    });
  }

  const total = filteredReports.length;
  const offset = (pageNumber - 1) * pageSize;
  const response: ReportsResponse = {
    data: filteredReports.slice(offset, offset + pageSize),
    total,
    pageNumber,
    pageSize,
  };

  return Response.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
