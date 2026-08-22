import type { Metadata } from "next";
import { AppShell } from "../components/shell/app-shell";
import { ReportsTable } from "./_components/reports-table";

export const metadata: Metadata = {
  title: "Content Reports | گزارش محتوا",
  description: "Bilingual content request reports",
};

export default function ReportsPage() {
  return (
    <AppShell>
      <ReportsTable />
    </AppShell>
  );
}
