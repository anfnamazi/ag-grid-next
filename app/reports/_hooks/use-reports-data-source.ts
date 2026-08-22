import type { ReportRow, ReportsResponse } from "@/lib/reports/types";
import type { IDatasource, IGetRowsParams } from "ag-grid-community";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";

type UseReportsDataSourceOptions = {
  loadErrorMessage: string;
  pageSize: number;
  search: string;
  setLoadError: Dispatch<SetStateAction<string | null>>;
  setTotalRows: Dispatch<SetStateAction<number>>;
};

export function useReportsDataSource({
  loadErrorMessage,
  pageSize,
  search,
  setLoadError,
  setTotalRows,
}: UseReportsDataSourceOptions) {
  return useMemo<IDatasource>(() => {
    const controllers = new Set<AbortController>();

    return {
      getRows(params: IGetRowsParams<ReportRow>) {
        const controller = new AbortController();
        controllers.add(controller);

        const requestRows = async () => {
          const pageNumber = Math.floor(params.startRow / pageSize) + 1;
          const searchParams = new URLSearchParams({
            pageNumber: String(pageNumber),
            pageSize: String(pageSize),
          });

          if (search.trim()) searchParams.set("search", search.trim());
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
            if (error instanceof DOMException && error.name === "AbortError") {
              return;
            }
            setTotalRows(0);
            setLoadError(loadErrorMessage);
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
  }, [loadErrorMessage, pageSize, search, setLoadError, setTotalRows]);
}
