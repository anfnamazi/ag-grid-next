import { DashboardContent } from "./components/dashboard/dashboard-content";
import { AppShell } from "./components/shell/app-shell";

export default function Home() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
