"use client";

import { Button, Input } from "@heroui/react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type DateFilterModel,
  type ICellRendererParams,
  type IDatasource,
  type IFilter,
  type IGetRowsParams,
  type ValueGetterParams,
} from "ag-grid-community";
import {
  AgGridReact,
  type CustomDateProps,
  type CustomFloatingFilterProps,
} from "ag-grid-react";
import {
  Clock3,
  History,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorianEn from "react-date-object/locales/gregorian_en";
import persianEn from "react-date-object/locales/persian_en";
import persianFa from "react-date-object/locales/persian_fa";
import {
  useCallback,
  useDeferredValue,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ReportRow,
  ReportsResponse,
  ReportStatus,
} from "./reports-types";
import { useLanguage } from "../components/language-provider";

ModuleRegistry.registerModules([AllCommunityModule]);

const DEFAULT_REPORT_ROW_HEIGHT = 54;

const statusClass: Record<ReportStatus, string> = {
  initial: "status-initial",
  review: "status-review",
  producing: "status-producing",
  produced: "status-produced",
  approved: "status-approved",
  uploaded: "status-uploaded",
  checked: "status-checked",
};

const statusOptions = Object.keys(statusClass) as ReportStatus[];
type StatusFilterModel = {
  filterType: "text";
  type: "equals";
  filter: string;
};

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

const persianDateTimeFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Tehran",
});

const englishDateFormatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

const englishDateTimeFormatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Tehran",
});

const toDate = (value?: string) => (value ? new Date(value) : null);
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
    if (match)
      return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
      ).getTime();
  }

  return null;
};

const dateFilterComparator = (filterDate: unknown, cellValue: unknown) => {
  const cellDate =
    cellValue instanceof Date
      ? cellValue
      : typeof cellValue === "string"
        ? new Date(cellValue)
        : null;
  const filterDay = getFilterDay(filterDate);
  if (!cellDate || Number.isNaN(cellDate.getTime()) || filterDay === null)
    return -1;
  const cellDay = toTehranLocalMidnight(cellDate).getTime();
  return cellDay === filterDay ? 0 : cellDay < filterDay ? -1 : 1;
};

const reportsCopy = {
  fa: {
    management: "مدیریت محتوا", title: "گزارش درخواست‌های محتوا",
    subtitle: "فهرست درخواست‌ها را جستجو، فیلتر و مرتب‌سازی کنید.", newRequest: "درخواست جدید",
    loadError: "دریافت گزارش‌ها با خطا مواجه شد.", retry: "تلاش دوباره",
    searchLabel: "جستجو در تمام گزارش‌ها", searchPlaceholder: "جستجو در تمام ستون‌ها...",
    registeredRequests: "درخواست ثبت‌شده", row: "ردیف", requestNumber: "شماره درخواست",
    requester: "درخواست کننده", createdAt: "تاریخ ثبت", subject: "عنوان محتوا",
    description: "شرح محتوا", showDate: "تاریخ نمایش", showTime: "زمان نمایش",
    showPlace: "محل نمایش", status: "وضعیت درخواست", operations: "عملیات",
    history: "نمایش سوابق", historyTitle: "نمایش سوابق ویرایش", edit: "ویرایش",
    statusHistory: "تاریخچه وضعیت", statusHistoryTitle: "تاریخچه تغییر وضعیت", delete: "حذف",
    request: "درخواست شماره", more: "بیشتر", less: "کمتر", statusFilter: "فیلتر وضعیت درخواست",
    all: "همه موارد", from: "از", to: "تا", chooseDate: "انتخاب تاریخ",
    clear: "پاک کردن", clearDateRange: "پاک کردن بازه تاریخ", clearDate: "پاک کردن تاریخ",
    statusLabels: {
      initial: "ثبت اولیه", review: "درحال بررسی", producing: "در حال تولید محتوا",
      produced: "محتوا تولید شد", approved: "کل محتوا تایید شد", uploaded: "بارگذاری شد",
      checked: "محتوای بارگذاری شده چک شد",
    } satisfies Record<ReportStatus, string>,
  },
  en: {
    management: "Content management", title: "Content request reports",
    subtitle: "Search, filter, and sort all content requests.", newRequest: "New request",
    loadError: "Unable to load reports.", retry: "Try again",
    searchLabel: "Search all reports", searchPlaceholder: "Search all columns...",
    registeredRequests: "registered requests", row: "Row", requestNumber: "Request number",
    requester: "Requester", createdAt: "Created at", subject: "Content title",
    description: "Description", showDate: "Display date", showTime: "Display time",
    showPlace: "Display location", status: "Request status", operations: "Actions",
    history: "View history", historyTitle: "View edit history", edit: "Edit",
    statusHistory: "Status history", statusHistoryTitle: "View status history", delete: "Delete",
    request: "request number", more: "Show more", less: "Show less", statusFilter: "Filter request status",
    all: "All items", from: "From", to: "To", chooseDate: "Choose date",
    clear: "Clear", clearDateRange: "Clear date range", clearDate: "Clear date",
    statusLabels: {
      initial: "Initial", review: "Under review", producing: "Producing content",
      produced: "Content produced", approved: "Content approved", uploaded: "Uploaded",
      checked: "Uploaded content checked",
    } satisfies Record<ReportStatus, string>,
  },
} as const;

const localeTextByLanguage = {
  fa: {
    page: "صفحه", more: "بیشتر", to: "تا", of: "از", next: "بعدی", last: "آخرین",
    first: "اولین", previous: "قبلی", loadingOoo: "در حال بارگذاری...",
    noRowsToShow: "داده‌ای برای نمایش وجود ندارد", pageSizeSelectorLabel: "تعداد در صفحه:",
    filterOoo: "جستجو...", equals: "برابر با", inRange: "بین دو تاریخ",
    inRangeStart: "از تاریخ", inRangeEnd: "تا تاریخ", greaterThanOrEqual: "از تاریخ به بعد",
    lessThanOrEqual: "تا تاریخ", notEqual: "نابرابر با", contains: "شامل",
    notContains: "شامل نباشد", startsWith: "شروع شود با", endsWith: "پایان یابد با",
    blank: "خالی", notBlank: "خالی نباشد", applyFilter: "اعمال", resetFilter: "بازنشانی",
    clearFilter: "پاک کردن", cancelFilter: "انصراف",
  },
  en: {
    page: "Page", more: "More", to: "to", of: "of", next: "Next", last: "Last",
    first: "First", previous: "Previous", loadingOoo: "Loading...", noRowsToShow: "No rows to show",
    pageSizeSelectorLabel: "Rows per page:", filterOoo: "Search...", equals: "Equals",
    inRange: "In range", inRangeStart: "From", inRangeEnd: "To",
    greaterThanOrEqual: "Greater than or equal", lessThanOrEqual: "Less than or equal",
    notEqual: "Not equal", contains: "Contains", notContains: "Does not contain",
    startsWith: "Starts with", endsWith: "Ends with", blank: "Blank", notBlank: "Not blank",
    applyFilter: "Apply", resetFilter: "Reset", clearFilter: "Clear", cancelFilter: "Cancel",
  },
} as const;

function OperationRenderer({ data }: ICellRendererParams<ReportRow>) {
  const { language } = useLanguage();
  const t = reportsCopy[language];
  if (!data) return null;
  const action = (label: string) =>
    window.alert(`${label} ${t.request} ${data.requestNumber}`);
  return (
    <div className="operation-buttons">
      <button
        type="button"
        title={t.historyTitle}
        aria-label={`${t.history} ${t.request} ${data.requestNumber}`}
        onClick={() => action(t.history)}
      >
        <History />
      </button>
      <button
        type="button"
        title={t.edit}
        aria-label={`${t.edit} ${t.request} ${data.requestNumber}`}
        onClick={() => action(t.edit)}
      >
        <Pencil />
      </button>
      <button
        type="button"
        title={t.statusHistoryTitle}
        aria-label={`${t.statusHistory} ${t.request} ${data.requestNumber}`}
        onClick={() => action(t.statusHistory)}
      >
        <Clock3 />
      </button>
      <button
        type="button"
        className="delete-action"
        title={t.delete}
        aria-label={`${t.delete} ${t.request} ${data.requestNumber}`}
        onClick={() => action(t.delete)}
      >
        <Trash2 />
      </button>
    </div>
  );
}

function StatusRenderer({
  value,
}: ICellRendererParams<ReportRow, ReportStatus>) {
  const { language } = useLanguage();
  return value ? (
    <span className={`status-badge ${statusClass[value]}`}>
      {reportsCopy[language].statusLabels[value]}
    </span>
  ) : null;
}

type ShowMoreCellRendererParams = ICellRendererParams<ReportRow, string> & {
  onExpandedHeightChange: (rowId: number, height: number | null) => void;
};

function ShowMoreCellRenderer({
  data,
  eGridCell,
  onExpandedHeightChange,
  value,
}: ShowMoreCellRendererParams) {
  const { language } = useLanguage();
  const t = reportsCopy[language];
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const description = value?.trim() ?? "";

  useLayoutEffect(() => {
    const text = textRef.current;
    if (!text || expanded) return;

    const measureOverflow = () => {
      setCanExpand(
        text.scrollHeight > text.clientHeight + 1 ||
          text.scrollWidth > text.clientWidth + 1,
      );
    };

    measureOverflow();
    const observer = new ResizeObserver(measureOverflow);
    observer.observe(text);
    return () => observer.disconnect();
  }, [description, expanded]);

  useLayoutEffect(() => {
    const renderer = rendererRef.current;
    const rowId = data?.id;
    if (!renderer || rowId === undefined || !expanded) {
      if (rowId !== undefined) onExpandedHeightChange(rowId, null);
      return;
    }

    const measureHeight = () => {
      const cellStyle = window.getComputedStyle(eGridCell);
      const verticalChrome =
        Number.parseFloat(cellStyle.paddingTop) +
        Number.parseFloat(cellStyle.paddingBottom) +
        Number.parseFloat(cellStyle.borderTopWidth) +
        Number.parseFloat(cellStyle.borderBottomWidth);

      onExpandedHeightChange(
        rowId,
        Math.ceil(renderer.getBoundingClientRect().height + verticalChrome),
      );
    };

    measureHeight();
    const observer = new ResizeObserver(measureHeight);
    observer.observe(renderer);

    return () => {
      observer.disconnect();
      onExpandedHeightChange(rowId, null);
    };
  }, [data?.id, eGridCell, expanded, onExpandedHeightChange]);

  if (!description) return <span>---</span>;

  return (
    <div
      ref={rendererRef}
      className={`description-renderer${expanded ? " expanded" : ""}`}
    >
      <span ref={textRef}>{description}</span>
      {canExpand && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((current) => !current);
          }}
        >
          {expanded ? t.less : t.more}
        </button>
      )}
    </div>
  );
}

function StatusFloatingFilter({
  model,
  onModelChange,
}: CustomFloatingFilterProps<IFilter, ReportRow, unknown, StatusFilterModel>) {
  const { language } = useLanguage();
  const t = reportsCopy[language];
  const updateFilter = (value: string) => {
    onModelChange(
      value ? { filterType: "text", type: "equals", filter: value } : null,
    );
  };

  return (
    <select
      aria-label={t.statusFilter}
      className="status-filter-select"
      value={model?.filter ?? ""}
      onChange={(event) => updateFilter(event.target.value)}
    >
      <option value="">{t.all}</option>
      {statusOptions.map((status) => (
        <option value={status} key={status}>
          {t.statusLabels[status]}
        </option>
      ))}
    </select>
  );
}

function PersianDateFloatingFilter({
  model,
  onModelChange,
}: CustomFloatingFilterProps<IFilter, ReportRow, unknown, DateFilterModel>) {
  const { language } = useLanguage();
  const t = reportsCopy[language];
  const pickerLocale = language === "fa" ? persianFa : persianEn;
  const toPickerDate = (date?: string | null) =>
    date
      ? new DateObject({
          date,
          format: "YYYY-MM-DD",
          calendar: gregorian,
        }).convert(persian, pickerLocale)
      : null;
  const toGregorianText = (date: DateObject | null) =>
    date
      ? new DateObject(date)
          .convert(gregorian, gregorianEn)
          .format("YYYY-MM-DD")
      : null;
  const startText =
    model?.type === "inRange" || model?.type === "greaterThanOrEqual"
      ? model.dateFrom
      : null;
  const endText =
    model?.type === "inRange"
      ? model.dateTo
      : model?.type === "lessThanOrEqual"
        ? model.dateFrom
        : null;
  const startValue = toPickerDate(startText);
  const endValue = toPickerDate(endText);

  const updateRange = (
    start: string | null | undefined,
    end: string | null | undefined,
  ) => {
    if (start && end) {
      onModelChange({
        filterType: "date",
        type: "inRange",
        dateFrom: start,
        dateTo: end,
      });
    } else if (start) {
      onModelChange({
        filterType: "date",
        type: "greaterThanOrEqual",
        dateFrom: start,
        dateTo: null,
      });
    } else if (end) {
      onModelChange({
        filterType: "date",
        type: "lessThanOrEqual",
        dateFrom: end,
        dateTo: null,
      });
    } else {
      onModelChange(null);
    }
  };

  return (
    <div className="persian-date-range-filter">
      <div className="range-date-field">
        <DatePicker
          calendar={persian}
          calendarPosition="bottom-center"
          className="persian-filter-calendar ag-custom-component-popup"
          editable={false}
          format="YYYY/MM/DD"
          inputClass="persian-date-filter-input"
          locale={pickerLocale}
          onChange={(date) => updateRange(toGregorianText(date), endText)}
          placeholder={t.from}
          portal
          value={startValue}
          zIndex={1000}
        />
      </div>
      <div className="range-date-field">
        <DatePicker
          calendar={persian}
          calendarPosition="bottom-center"
          className="persian-filter-calendar ag-custom-component-popup"
          editable={false}
          format="YYYY/MM/DD"
          inputClass="persian-date-filter-input"
          locale={pickerLocale}
          onChange={(date) => updateRange(startText, toGregorianText(date))}
          placeholder={t.to}
          portal
          value={endValue}
          zIndex={1000}
        />
      </div>
      {(startValue || endValue) && (
        <button
          type="button"
          aria-label={t.clearDateRange}
          title={t.clear}
          onClick={() => updateRange(null, null)}
        >
          <X />
        </button>
      )}
    </div>
  );
}

function PersianDateInput({
  date,
  onDateChange,
  onFocusIn,
}: CustomDateProps<ReportRow>) {
  const { language } = useLanguage();
  const t = reportsCopy[language];
  const pickerLocale = language === "fa" ? persianFa : persianEn;
  const pickerValue = date
    ? new DateObject({ date, calendar: gregorian }).convert(
        persian,
        pickerLocale,
      )
    : null;

  const selectDate = (selected: DateObject | null) => {
    if (!selected) {
      onDateChange(null);
      return;
    }

    const converted = new DateObject(selected).convert(gregorian, gregorianEn);
    onDateChange(
      new Date(converted.year, converted.month.number - 1, converted.day),
    );
  };

  return (
    <div className="persian-popup-date-input">
      <DatePicker
        calendar={persian}
        calendarPosition="bottom-center"
        className="persian-filter-calendar ag-custom-component-popup"
        editable={false}
        format="YYYY/MM/DD"
        inputClass="persian-date-filter-input"
        locale={pickerLocale}
        onChange={selectDate}
        onOpen={() => {
          onFocusIn?.();
          return true;
        }}
        placeholder={t.chooseDate}
        portal
        value={pickerValue}
        zIndex={1100}
      />
      {pickerValue && (
        <button
          type="button"
          aria-label={t.clearDate}
          title={t.clear}
          onClick={() => selectDate(null)}
        >
          <X />
        </button>
      )}
    </div>
  );
}

export function ReportsTable() {
  const { direction, language, locale } = useLanguage();
  const t = reportsCopy[language];
  const localeText = localeTextByLanguage[language];
  const dateFormatter = language === "fa" ? persianDateFormatter : englishDateFormatter;
  const dateTimeFormatter = language === "fa" ? persianDateTimeFormatter : englishDateTimeFormatter;
  const [quickFilter, setQuickFilter] = useState("");
  const deferredQuickFilter = useDeferredValue(quickFilter);
  const [totalRows, setTotalRows] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  // The Infinite Row Model supports one row height, so it must fit the
  // tallest description that is currently expanded.
  const expandedDescriptionHeights = useRef(new Map<number, number>());
  const [rowHeight, setRowHeight] = useState(DEFAULT_REPORT_ROW_HEIGHT);

  const updateExpandedDescriptionHeight = useCallback(
    (rowId: number, height: number | null) => {
      const heights = expandedDescriptionHeights.current;
      if (height === null) heights.delete(rowId);
      else heights.set(rowId, height);

      const nextRowHeight = Math.max(
        DEFAULT_REPORT_ROW_HEIGHT,
        ...heights.values(),
      );
      setRowHeight((current) =>
        current === nextRowHeight ? current : nextRowHeight,
      );
    },
    [],
  );

  const dataSource = useMemo<IDatasource>(() => {
    const controllers = new Set<AbortController>();

    return {
      getRows(params: IGetRowsParams<ReportRow>) {
        const controller = new AbortController();
        controllers.add(controller);

        const requestRows = async () => {
          const requestedPageSize = pageSize;
          const pageNumber = Math.floor(params.startRow / requestedPageSize) + 1;
          const searchParams = new URLSearchParams({
            pageNumber: String(pageNumber),
            pageSize: String(requestedPageSize),
          });

          if (deferredQuickFilter.trim()) {
            searchParams.set("search", deferredQuickFilter.trim());
          }
          if (Object.keys(params.filterModel).length) {
            searchParams.set("filter", JSON.stringify(params.filterModel));
          }
          if (params.sortModel.length) {
            searchParams.set("sort", JSON.stringify(params.sortModel));
          }

          try {
            setLoadError(null);
            const response = await fetch(`/api/reports?${searchParams}`, {
              cache: "no-store",
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }

            const result = (await response.json()) as ReportsResponse;
            if (!Array.isArray(result.data) || !Number.isFinite(result.total)) {
              throw new Error("Invalid reports response");
            }

            setTotalRows(result.total);
            params.successCallback(result.data, result.total);
          } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            setTotalRows(0);
            setLoadError(t.loadError);
            params.failCallback();
          } finally {
            controllers.delete(controller);
          }
        };

        void requestRows();
      },
      destroy() {
        controllers.forEach((controller) => controller.abort());
        controllers.clear();
      },
    };
  }, [deferredQuickFilter, pageSize, t.loadError]);

  const columns = useMemo<ColDef<ReportRow>[]>(
    () => [
      {
        headerName: t.row,
        width: 76,
        minWidth: 76,
        sortable: false,
        filter: false,
        floatingFilter: false,
        pinned: "right",
        valueGetter: (params: ValueGetterParams<ReportRow>) =>
          (params.node?.rowIndex ?? 0) + 1,
      },
      {
        field: "requestNumber",
        headerName: t.requestNumber,
        width: 130,
        filter: "agNumberColumnFilter",
      },
      { field: "requester", headerName: t.requester, width: 145 },
      {
        colId: "createdAt",
        headerName: t.createdAt,
        width: 245,
        cellDataType: "date",
        dateComponent: PersianDateInput,
        filter: "agDateColumnFilter",
        filterParams: {
          comparator: dateFilterComparator,
          defaultOption: "inRange",
          filterOptions: ["inRange", "greaterThanOrEqual", "lessThanOrEqual"],
          inRangeInclusive: true,
          maxNumConditions: 1,
        },
        floatingFilterComponent: PersianDateFloatingFilter,
        valueGetter: (params) => toDate(params.data?.createdAt),
        valueFormatter: (params) =>
          params.value instanceof Date
            ? dateTimeFormatter.format(params.value)
            : "---",
      },
      {
        field: "subject",
        headerName: t.subject,
        minWidth: 165,
        flex: 1,
        tooltipField: "subject",
      },
      {
        field: "description",
        headerName: t.description,
        minWidth: 210,
        flex: 1.35,
        cellClass: "description-cell",
        cellRenderer: ShowMoreCellRenderer,
        cellRendererParams: {
          onExpandedHeightChange: updateExpandedDescriptionHeight,
        },
      },
      {
        colId: "showDate",
        headerName: t.showDate,
        width: 245,
        cellDataType: "date",
        dateComponent: PersianDateInput,
        filter: "agDateColumnFilter",
        filterParams: {
          comparator: dateFilterComparator,
          defaultOption: "inRange",
          filterOptions: ["inRange", "greaterThanOrEqual", "lessThanOrEqual"],
          inRangeInclusive: true,
          maxNumConditions: 1,
        },
        floatingFilterComponent: PersianDateFloatingFilter,
        valueGetter: (params) => toDate(params.data?.showDate),
        valueFormatter: (params) =>
          params.value instanceof Date
            ? dateFormatter.format(params.value)
            : "---",
      },
      {
        field: "showTime",
        headerName: t.showTime,
        width: 120,
        filter: "agTextColumnFilter",
      },
      { field: "showPlace", headerName: t.showPlace, width: 135 },
      {
        field: "status",
        headerName: t.status,
        width: 190,
        cellRenderer: StatusRenderer,
        filter: "agTextColumnFilter",
        filterParams: {
          defaultOption: "equals",
          filterOptions: ["equals"],
          maxNumConditions: 1,
        },
        floatingFilterComponent: StatusFloatingFilter,
      },
      {
        headerName: t.operations,
        width: 155,
        minWidth: 155,
        sortable: false,
        filter: false,
        floatingFilter: false,
        pinned: "left",
        cellRenderer: OperationRenderer,
      },
    ],
    [dateFormatter, dateTimeFormatter, t, updateExpandedDescriptionHeight],
  );

  const defaultColDef = useMemo<ColDef<ReportRow>>(
    () => ({
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      suppressHeaderMenuButton: false,
    }),
    [],
  );

  return (
    <>
      <div className="reports-heading">
        <div>
          <p>{t.management}</p>
          <h1>{t.title}</h1>
          <span>{t.subtitle}</span>
        </div>
        <Button variant="primary">
          <Plus /> {t.newRequest}
        </Button>
      </div>
      <section className="reports-panel">
        {loadError && (
          <div className="reports-error" role="alert">
            <span>{loadError}</span>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
              <RefreshCw /> {t.retry}
            </button>
          </div>
        )}
        <div className="reports-toolbar">
          <div className="reports-search">
            <Search />
            <Input
              aria-label={t.searchLabel}
              fullWidth
              placeholder={t.searchPlaceholder}
              value={quickFilter}
              onChange={(event) => setQuickFilter(event.target.value)}
              variant="secondary"
            />
          </div>
          <div className="reports-count">
            <strong>{totalRows.toLocaleString(locale)}</strong>
            <span>{t.registeredRequests}</span>
          </div>
        </div>
        <div className="reports-grid" dir={direction}>
          <AgGridReact<ReportRow>
            key={`${language}-${reloadKey}`}
            columnDefs={columns}
            defaultColDef={defaultColDef}
            enableRtl={language === "fa"}
            datasource={dataSource}
            getRowId={(params) => String(params.data.id)}
            localeText={localeText}
            rowModelType="infinite"
            pagination
            cacheBlockSize={pageSize}
            paginationPageSize={pageSize}
            paginationPageSizeSelector={[5, 10, 50]}
            onPaginationChanged={(event) => {
              const nextPageSize = event.api.paginationGetPageSize();
              setPageSize((current) =>
                current === nextPageSize ? current : nextPageSize,
              );
            }}
            rowHeight={rowHeight}
            headerHeight={48}
            floatingFiltersHeight={45}
            theme={themeQuartz}
            animateRows
            rowSelection={"multiple"}
          />
        </div>
      </section>
    </>
  );
}
