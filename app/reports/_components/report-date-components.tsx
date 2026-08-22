"use client";

import { useLanguage } from "@/app/components/language-provider";
import type { ReportRow } from "@/lib/reports/types";
import type { DateFilterModel, IFilter } from "ag-grid-community";
import type {
  CustomDateProps,
  CustomFloatingFilterProps,
} from "ag-grid-react";
import { X } from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorianEn from "react-date-object/locales/gregorian_en";
import persianEn from "react-date-object/locales/persian_en";
import persianFa from "react-date-object/locales/persian_fa";
import { reportsCopy } from "../_lib/reports-copy";

const toGregorianText = (date: DateObject | null) =>
  date
    ? new DateObject(date)
        .convert(gregorian, gregorianEn)
        .format("YYYY-MM-DD")
    : null;

export function PersianDateFloatingFilter({
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

export function PersianDateInput({
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
