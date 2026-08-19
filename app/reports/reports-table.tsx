"use client";

import { Button, Input } from "@heroui/react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
  type ValueGetterParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Clock3, History, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
  const action = (label: string) => window.alert(`${label} درخواست شماره ${data.requestNumber}`);
  return <div className="operation-buttons">
    <button type="button" title="نمایش سوابق ویرایش" aria-label={`نمایش سوابق درخواست ${data.requestNumber}`} onClick={() => action("نمایش سوابق")}><History/></button>
    <button type="button" title="ویرایش" aria-label={`ویرایش درخواست ${data.requestNumber}`} onClick={() => action("ویرایش")}><Pencil/></button>
    <button type="button" title="تاریخچه تغییر وضعیت" aria-label={`تاریخچه وضعیت درخواست ${data.requestNumber}`} onClick={() => action("تاریخچه وضعیت")}><Clock3/></button>
    <button type="button" className="delete-action" title="حذف" aria-label={`حذف درخواست ${data.requestNumber}`} onClick={() => action("حذف")}><Trash2/></button>
  </div>;
}

function StatusRenderer({ value }: ICellRendererParams<ReportRow, ReportStatus>) {
  return value ? <span className={`status-badge ${statusClass[value]}`}>{value}</span> : null;
}

export function ReportsTable() {
  const [quickFilter, setQuickFilter] = useState("");
  const columns = useMemo<ColDef<ReportRow>[]>(() => [
    {
      headerName: "ردیف",
      width: 76,
      minWidth: 76,
      sortable: false,
      filter: false,
      floatingFilter: false,
      pinned: "right",
      valueGetter: (params: ValueGetterParams<ReportRow>) => (params.node?.rowIndex ?? 0) + 1,
    },
    { field: "requestNumber", headerName: "شماره درخواست", width: 130, filter: "agNumberColumnFilter" },
    { field: "requester", headerName: "درخواست کننده", width: 145 },
    { field: "subject", headerName: "عنوان محتوا", minWidth: 165, flex: 1, tooltipField: "subject" },
    { field: "description", headerName: "شرح محتوا", minWidth: 210, flex: 1.35, tooltipField: "description" },
    { field: "showDate", headerName: "تاریخ نمایش", width: 135 },
    { field: "showTime", headerName: "زمان نمایش", width: 120 },
    { field: "showPlace", headerName: "محل نمایش", width: 135 },
    { field: "status", headerName: "وضعیت درخواست", width: 190, cellRenderer: StatusRenderer },
    { headerName: "عملیات", width: 155, minWidth: 155, sortable: false, filter: false, floatingFilter: false, pinned: "left", cellRenderer: OperationRenderer },
  ], []);

  const defaultColDef = useMemo<ColDef<ReportRow>>(() => ({
    sortable: true,
    resizable: true,
    filter: "agTextColumnFilter",
    floatingFilter: true,
    suppressHeaderMenuButton: false,
  }), []);

  return <>
    <div className="reports-heading">
      <div><p>مدیریت محتوا</p><h1>گزارش درخواست‌های محتوا</h1><span>فهرست درخواست‌ها را جستجو، فیلتر و مرتب‌سازی کنید.</span></div>
      <Button variant="primary"><Plus/> درخواست جدید</Button>
    </div>
    <section className="reports-panel">
      <div className="reports-toolbar">
        <div className="reports-search"><Search/><Input aria-label="جستجو در تمام گزارش‌ها" fullWidth placeholder="جستجو در تمام ستون‌ها..." value={quickFilter} onChange={(event) => setQuickFilter(event.target.value)} variant="secondary"/></div>
        <div className="reports-count"><strong>{reportRows.length.toLocaleString("fa-IR")}</strong><span>درخواست ثبت‌شده</span></div>
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
  </>;
}
