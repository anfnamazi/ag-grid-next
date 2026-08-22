import { Ellipsis, TrendingUp } from "lucide-react";
import type { DashboardStat } from "./dashboard-copy";

type StatCardProps = {
  item: DashboardStat;
  options: string;
};

export function StatCard({ item, options }: StatCardProps) {
  return (
    <article className={`stat-card stat-${item.color}`}>
      <div className="stat-top">
        <span>{item.label}</span>
        <button aria-label={`${options} ${item.label}`} type="button">
          <Ellipsis />
        </button>
      </div>
      <strong className="stat-value">{item.value}</strong>
      <div className="stat-meta">
        <span>
          <TrendingUp />
          {item.change}
        </span>
        <small>{item.note}</small>
      </div>
      <div className="stat-decoration">
        <i />
        <i />
        <i />
      </div>
    </article>
  );
}
