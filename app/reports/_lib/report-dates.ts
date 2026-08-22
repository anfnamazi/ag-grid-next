import type { Language } from "@/app/components/language-provider";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";

const createFormatter = (locale: string, includeTime: boolean) =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23" as const,
        }
      : {}),
    timeZone: "Asia/Tehran",
  });

const dateFormatters = {
  fa: createFormatter("fa-IR-u-ca-persian", false),
  en: createFormatter("en-US-u-ca-persian", false),
};

const dateTimeFormatters = {
  fa: createFormatter("fa-IR-u-ca-persian", true),
  en: createFormatter("en-US-u-ca-persian", true),
};

const tehranDatePartsFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

const toTehranLocalMidnight = (date: Date) => {
  const parts = Object.fromEntries(
    tehranDatePartsFormatter
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );

  return new Date(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
  );
};

const getFilterDay = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
    ).getTime();
  }

  if (value instanceof DateObject) {
    const date = new DateObject(value).convert(gregorian);
    return new Date(date.year, date.month.number - 1, date.day).getTime();
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
      ).getTime();
    }
  }

  return null;
};

export const toDate = (value?: string) => (value ? new Date(value) : null);

export const dateFilterComparator = (
  filterDate: unknown,
  cellValue: unknown,
) => {
  const cellDate =
    cellValue instanceof Date
      ? cellValue
      : typeof cellValue === "string"
        ? new Date(cellValue)
        : null;
  const filterDay = getFilterDay(filterDate);
  if (!cellDate || Number.isNaN(cellDate.getTime()) || filterDay === null) {
    return -1;
  }

  const cellDay = toTehranLocalMidnight(cellDate).getTime();
  return cellDay === filterDay ? 0 : cellDay < filterDay ? -1 : 1;
};

export const getReportDateFormatters = (language: Language) => ({
  date: dateFormatters[language],
  dateTime: dateTimeFormatters[language],
});
