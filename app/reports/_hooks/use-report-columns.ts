import type { ReportRow } from "@/lib/reports/types";
import type { ColDef, ValueGetterParams } from "ag-grid-community";
import { useMemo } from "react";
import {
  PersianDateFloatingFilter,
  PersianDateInput,
} from "../_components/report-date-components";
import {
  DescriptionRenderer,
  OperationRenderer,
  StatusFloatingFilter,
  StatusRenderer,
} from "../_components/report-grid-components";
import {
  dateFilterComparator,
  getReportDateFormatters,
  toDate,
} from "../_lib/report-dates";
import type { ReportsCopy } from "../_lib/reports-copy";

type UseReportColumnsOptions = {
  language: "fa" | "en";
  onExpandedHeightChange: (rowId: number, height: number | null) => void;
  translations: ReportsCopy;
};

const dateFilterParams = {
  comparator: dateFilterComparator,
  defaultOption: "inRange",
  filterOptions: ["inRange", "greaterThanOrEqual", "lessThanOrEqual"],
  inRangeInclusive: true,
  maxNumConditions: 1,
} as const;

export function useReportColumns({
  language,
  onExpandedHeightChange,
  translations: t,
}: UseReportColumnsOptions) {
  const formatters = getReportDateFormatters(language);

  return useMemo<ColDef<ReportRow>[]>(
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
        filterParams: dateFilterParams,
        floatingFilterComponent: PersianDateFloatingFilter,
        valueGetter: (params) => toDate(params.data?.createdAt),
        valueFormatter: (params) =>
          params.value instanceof Date
            ? formatters.dateTime.format(params.value)
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
        cellRenderer: DescriptionRenderer,
        cellRendererParams: { onExpandedHeightChange },
      },
      {
        colId: "showDate",
        headerName: t.showDate,
        width: 245,
        cellDataType: "date",
        dateComponent: PersianDateInput,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
        floatingFilterComponent: PersianDateFloatingFilter,
        valueGetter: (params) => toDate(params.data?.showDate),
        valueFormatter: (params) =>
          params.value instanceof Date
            ? formatters.date.format(params.value)
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
    [formatters.date, formatters.dateTime, onExpandedHeightChange, t],
  );
}
