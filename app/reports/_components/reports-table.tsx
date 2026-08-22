"use client";

import { useLanguage } from "@/app/components/language-provider";
import type { ReportRow } from "@/lib/reports/types";
import { Button, Input } from "@heroui/react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { useInfiniteRowHeight } from "../_hooks/use-infinite-row-height";
import { useReportColumns } from "../_hooks/use-report-columns";
import { useReportsDataSource } from "../_hooks/use-reports-data-source";
import { gridLocaleText, reportsCopy } from "../_lib/reports-copy";

ModuleRegistry.registerModules([AllCommunityModule]);

const defaultColumnDefinition: ColDef<ReportRow> = {
  sortable: true,
  resizable: true,
  filter: "agTextColumnFilter",
  floatingFilter: true,
  suppressHeaderMenuButton: false,
};

export function ReportsTable() {
  const { direction, language, locale } = useLanguage();
  const t = reportsCopy[language];
  const [quickFilter, setQuickFilter] = useState("");
  const deferredQuickFilter = useDeferredValue(quickFilter);
  const [totalRows, setTotalRows] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const { rowHeight, updateExpandedHeight } = useInfiniteRowHeight();

  const dataSource = useReportsDataSource({
    loadErrorMessage: t.loadError,
    pageSize,
    search: deferredQuickFilter,
    setLoadError,
    setTotalRows,
  });
  const columns = useReportColumns({
    language,
    onExpandedHeightChange: updateExpandedHeight,
    translations: t,
  });

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
            defaultColDef={defaultColumnDefinition}
            enableRtl={language === "fa"}
            datasource={dataSource}
            getRowId={(params) => String(params.data.id)}
            localeText={gridLocaleText[language]}
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
            rowSelection="multiple"
          />
        </div>
      </section>
    </>
  );
}
