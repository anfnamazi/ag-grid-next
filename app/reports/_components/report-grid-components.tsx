"use client";

import { useLanguage } from "@/app/components/language-provider";
import type { ReportRow, ReportStatus } from "@/lib/reports/types";
import type {
  ICellRendererParams,
  IFilter,
} from "ag-grid-community";
import type { CustomFloatingFilterProps } from "ag-grid-react";
import { Clock3, History, Pencil, Trash2 } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { reportsCopy } from "../_lib/reports-copy";

const statusClasses: Record<ReportStatus, string> = {
  initial: "status-initial",
  review: "status-review",
  producing: "status-producing",
  produced: "status-produced",
  approved: "status-approved",
  uploaded: "status-uploaded",
  checked: "status-checked",
};

const statusOptions = Object.keys(statusClasses) as ReportStatus[];

type StatusFilterModel = {
  filterType: "text";
  type: "equals";
  filter: string;
};

type DescriptionRendererParams = ICellRendererParams<ReportRow, string> & {
  onExpandedHeightChange: (rowId: number, height: number | null) => void;
};

export function OperationRenderer({
  data,
}: ICellRendererParams<ReportRow>) {
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

export function StatusRenderer({
  value,
}: ICellRendererParams<ReportRow, ReportStatus>) {
  const { language } = useLanguage();

  return value ? (
    <span className={`status-badge ${statusClasses[value]}`}>
      {reportsCopy[language].statusLabels[value]}
    </span>
  ) : null;
}

export function DescriptionRenderer({
  data,
  eGridCell,
  onExpandedHeightChange,
  value,
}: DescriptionRendererParams) {
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

export function StatusFloatingFilter({
  model,
  onModelChange,
}: CustomFloatingFilterProps<IFilter, ReportRow, unknown, StatusFilterModel>) {
  const { language } = useLanguage();
  const t = reportsCopy[language];

  return (
    <select
      aria-label={t.statusFilter}
      className="status-filter-select"
      value={model?.filter ?? ""}
      onChange={(event) =>
        onModelChange(
          event.target.value
            ? {
                filterType: "text",
                type: "equals",
                filter: event.target.value,
              }
            : null,
        )
      }
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
