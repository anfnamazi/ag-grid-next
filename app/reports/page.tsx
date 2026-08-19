import type { Metadata } from "next";
import { AppShell } from "../components/app-shell";
import { ReportsTable } from "./reports-table";

export const metadata: Metadata = {
  title: "گزارش محتوا",
  description: "فهرست و گزارش درخواست‌های محتوایی",
};

export default function ReportsPage() {
  return <AppShell><ReportsTable /></AppShell>;
}
