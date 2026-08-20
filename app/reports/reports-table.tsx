"use client";

import { Button, Input } from "@heroui/react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type DateFilterModel,
  type ICellRendererParams,
  type IFilter,
  type ValueGetterParams,
} from "ag-grid-community";
import {
  AgGridReact,
  type CustomDateProps,
  type CustomFloatingFilterProps,
} from "ag-grid-react";
import { Clock3, History, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorianEn from "react-date-object/locales/gregorian_en";
import persianFa from "react-date-object/locales/persian_fa";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { reportRows, type ReportRow, type ReportStatus } from "./reports-data";

ModuleRegistry.registerModules([AllCommunityModule]);

const statusClass: Record<ReportStatus, string> = {
  "ثبت اولیه": "status-initial",
  "درحال بررسی": "status-review",
  "در حال تولید محتوا": "status-producing",
  "محتوا تولید شد": "status-produced",
  "کل محتوا تایید شد": "status-approved",
  "بارگذاری شد": "status-uploaded",
  "محتوای بارگذاری شده چک شد": "status-checked",
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

const localeText = {
  page: "صفحه",
  more: "بیشتر",
  to: "تا",
  of: "از",
  next: "بعدی",
  last: "آخرین",
  first: "اولین",
  previous: "قبلی",
  loadingOoo: "در حال بارگذاری...",
  noRowsToShow: "داده‌ای برای نمایش وجود ندارد",
  pageSizeSelectorLabel: "تعداد در صفحه:",
  filterOoo: "جستجو...",
  equals: "برابر با",
  inRange: "بین دو تاریخ",
  inRangeStart: "از تاریخ",
  inRangeEnd: "تا تاریخ",
  greaterThanOrEqual: "از تاریخ به بعد",
  lessThanOrEqual: "تا تاریخ",
  notEqual: "نابرابر با",
  contains: "شامل",
  notContains: "شامل نباشد",
  startsWith: "شروع شود با",
  endsWith: "پایان یابد با",
  blank: "خالی",
  notBlank: "خالی نباشد",
  applyFilter: "اعمال",
  resetFilter: "بازنشانی",
  clearFilter: "پاک کردن",
  cancelFilter: "انصراف",
};

function OperationRenderer({ data }: ICellRendererParams<ReportRow>) {
  if (!data) return null;
  const action = (label: string) =>
    window.alert(`${label} درخواست شماره ${data.requestNumber}`);
  return (
    <div className="operation-buttons">
      <button
        type="button"
        title="نمایش سوابق ویرایش"
        aria-label={`نمایش سوابق درخواست ${data.requestNumber}`}
        onClick={() => action("نمایش سوابق")}
      >
        <History />
      </button>
      <button
        type="button"
        title="ویرایش"
        aria-label={`ویرایش درخواست ${data.requestNumber}`}
        onClick={() => action("ویرایش")}
      >
        <Pencil />
      </button>
      <button
        type="button"
        title="تاریخچه تغییر وضعیت"
        aria-label={`تاریخچه وضعیت درخواست ${data.requestNumber}`}
        onClick={() => action("تاریخچه وضعیت")}
      >
        <Clock3 />
      </button>
      <button
        type="button"
        className="delete-action"
        title="حذف"
        aria-label={`حذف درخواست ${data.requestNumber}`}
        onClick={() => action("حذف")}
      >
        <Trash2 />
      </button>
    </div>
  );
}

function StatusRenderer({
  value,
}: ICellRendererParams<ReportRow, ReportStatus>) {
  return value ? (
    <span className={`status-badge ${statusClass[value]}`}>{value}</span>
  ) : null;
}

function ShowMoreCellRenderer({
  value,
}: ICellRendererParams<ReportRow, string>) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
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

  if (!description) return <span>---</span>;

  return (
    <div className={`description-renderer${expanded ? " expanded" : ""}`}>
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
          {expanded ? "کمتر" : "بیشتر"}
        </button>
      )}
    </div>
  );
}

function StatusFloatingFilter({
  model,
  onModelChange,
}: CustomFloatingFilterProps<IFilter, ReportRow, unknown, StatusFilterModel>) {
  const updateFilter = (value: string) => {
    onModelChange(
      value ? { filterType: "text", type: "equals", filter: value } : null,
    );
  };

  return (
    <select
      aria-label="فیلتر وضعیت درخواست"
      className="status-filter-select"
      value={model?.filter ?? ""}
      onChange={(event) => updateFilter(event.target.value)}
    >
      <option value="">همه موارد</option>
      {statusOptions.map((status) => (
        <option value={status} key={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function PersianDateFloatingFilter({
  model,
  onModelChange,
}: CustomFloatingFilterProps<IFilter, ReportRow, unknown, DateFilterModel>) {
  const toPersianDate = (date?: string | null) =>
    date
      ? new DateObject({
          date,
          format: "YYYY-MM-DD",
          calendar: gregorian,
        }).convert(persian, persianFa)
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
  const startValue = toPersianDate(startText);
  const endValue = toPersianDate(endText);

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
          locale={persianFa}
          onChange={(date) => updateRange(toGregorianText(date), endText)}
          placeholder="از"
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
          locale={persianFa}
          onChange={(date) => updateRange(startText, toGregorianText(date))}
          placeholder="تا"
          portal
          value={endValue}
          zIndex={1000}
        />
      </div>
      {(startValue || endValue) && (
        <button
          type="button"
          aria-label="پاک کردن بازه تاریخ"
          title="پاک کردن"
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
  const pickerValue = date
    ? new DateObject({ date, calendar: gregorian }).convert(persian, persianFa)
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
        locale={persianFa}
        onChange={selectDate}
        onOpen={() => {
          onFocusIn?.();
          return true;
        }}
        placeholder="انتخاب تاریخ"
        portal
        value={pickerValue}
        zIndex={1100}
      />
      {pickerValue && (
        <button
          type="button"
          aria-label="پاک کردن تاریخ"
          title="پاک کردن"
          onClick={() => selectDate(null)}
        >
          <X />
        </button>
      )}
    </div>
  );
}

export function ReportsTable() {
  const [quickFilter, setQuickFilter] = useState("");
  const columns = useMemo<ColDef<ReportRow>[]>(
    () => [
      {
        headerName: "ردیف",
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
        headerName: "شماره درخواست",
        width: 130,
        filter: "agNumberColumnFilter",
      },
      { field: "requester", headerName: "درخواست کننده", width: 145 },
      {
        colId: "createdAt",
        headerName: "تاریخ ثبت",
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
            ? persianDateTimeFormatter.format(params.value)
            : "---",
      },
      {
        field: "subject",
        headerName: "عنوان محتوا",
        minWidth: 165,
        flex: 1,
        tooltipField: "subject",
      },
      {
        field: "description",
        headerName: "شرح محتوا",
        minWidth: 210,
        flex: 1.35,
        autoHeight: true,
        cellClass: "description-cell",
        cellRenderer: ShowMoreCellRenderer,
      },
      {
        colId: "showDate",
        headerName: "تاریخ نمایش",
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
            ? persianDateFormatter.format(params.value)
            : "---",
      },
      {
        field: "showTime",
        headerName: "زمان نمایش",
        width: 120,
        filter: "agTextColumnFilter",
      },
      { field: "showPlace", headerName: "محل نمایش", width: 135 },
      {
        field: "status",
        headerName: "وضعیت درخواست",
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
        headerName: "عملیات",
        width: 155,
        minWidth: 155,
        sortable: false,
        filter: false,
        floatingFilter: false,
        pinned: "left",
        cellRenderer: OperationRenderer,
      },
    ],
    [],
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
          <p>مدیریت محتوا</p>
          <h1>گزارش درخواست‌های محتوا</h1>
          <span>فهرست درخواست‌ها را جستجو، فیلتر و مرتب‌سازی کنید.</span>
        </div>
        <Button variant="primary">
          <Plus /> درخواست جدید
        </Button>
      </div>
      <section className="reports-panel">
        <div className="reports-toolbar">
          <div className="reports-search">
            <Search />
            <Input
              aria-label="جستجو در تمام گزارش‌ها"
              fullWidth
              placeholder="جستجو در تمام ستون‌ها..."
              value={quickFilter}
              onChange={(event) => setQuickFilter(event.target.value)}
              variant="secondary"
            />
          </div>
          <div className="reports-count">
            <strong>{reportRows.length.toLocaleString("fa-IR")}</strong>
            <span>درخواست ثبت‌شده</span>
          </div>
        </div>
        <div className="reports-grid" dir="rtl">
          <AgGridReact<ReportRow>
            columnDefs={columns}
            defaultColDef={defaultColDef}
            enableRtl
            getRowId={(params) => String(params.data.id)}
            localeText={localeText}
            pagination
            paginationPageSize={2}
            paginationPageSizeSelector={[2, 5, 10]}
            quickFilterText={quickFilter}
            rowData={reportRows}
            rowHeight={54}
            headerHeight={48}
            floatingFiltersHeight={45}
            theme={themeQuartz}
            animateRows
          />
        </div>
      </section>
    </>
  );
}
