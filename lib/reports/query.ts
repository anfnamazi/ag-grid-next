import "server-only";

import { reportRows } from "./mock-data";
import type { ReportRow, ReportsResponse } from "./types";

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

const reportFields: Record<string, keyof ReportRow> = {
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
    const matches = model.conditions.map((condition) =>
      matchesCondition(value, condition),
    );
    return model.operator === "OR" ? matches.some(Boolean) : matches.every(Boolean);
  }

  const type = model.type ?? "contains";
  const isBlank =
    value === null || value === undefined || String(value).trim() === "";
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

export function queryReports(searchParams: URLSearchParams): ReportsResponse {
  const pageNumber = Math.max(
    1,
    Number(searchParams.get("pageNumber")) || 1,
  );
  const pageSize = Math.min(
    100,
    Math.max(1, Number(searchParams.get("pageSize")) || 5),
  );
  const filterModel = parseJson<Record<string, ApiFilterModel>>(
    searchParams.get("filter"),
    {},
  );
  const sortModel = parseJson<ApiSortModel[]>(searchParams.get("sort"), []);
  const search = (searchParams.get("search") ?? "")
    .trim()
    .toLocaleLowerCase();

  let matchingRows = reportRows.filter((report) => {
    const matchesSearch =
      !search ||
      Object.values(report).some((value) =>
        String(value).toLocaleLowerCase().includes(search),
      );
    if (!matchesSearch) return false;

    return Object.entries(filterModel).every(([columnId, model]) => {
      const field = reportFields[columnId];
      return field ? matchesCondition(report[field], model) : true;
    });
  });

  if (sortModel.length) {
    matchingRows = [...matchingRows].sort((first, second) => {
      for (const sort of sortModel) {
        const field = reportFields[sort.colId];
        if (!field) continue;

        const result = compare(first[field], second[field]);
        if (result !== 0) return sort.sort === "desc" ? -result : result;
      }
      return 0;
    });
  }

  const total = matchingRows.length;
  const offset = (pageNumber - 1) * pageSize;

  return {
    data: matchingRows.slice(offset, offset + pageSize),
    total,
    pageNumber,
    pageSize,
  };
}
