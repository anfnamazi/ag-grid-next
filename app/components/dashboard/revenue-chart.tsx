import { TrendingUp } from "lucide-react";
import type { DashboardCopy } from "./dashboard-copy";

export function RevenueChart({ translations: t }: { translations: DashboardCopy }) {
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h2>{t.revenueTitle}</h2>
          <p>{t.revenueSubtitle}</p>
        </div>
        <select aria-label={t.rangeLabel}>
          {t.ranges.map((range) => (
            <option key={range}>{range}</option>
          ))}
        </select>
      </div>
      <div className="chart-summary">
        <strong>{t.revenueValue}</strong>
        <span>
          <TrendingUp /> {t.revenueGrowth}
        </span>
      </div>
      <div className="chart-wrap">
        <div className="y-axis">
          <span>300</span>
          <span>225</span>
          <span>150</span>
          <span>75</span>
          <span>0</span>
        </div>
        <div className="chart-canvas">
          <div className="grid-lines">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <svg
            viewBox="0 0 700 210"
            preserveAspectRatio="none"
            role="img"
            aria-label={t.chartLabel}
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f8b900" stopOpacity=".28" />
                <stop offset="1" stopColor="#f8b900" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="chart-area"
              d="M0 182 C55 169 83 144 140 153 S225 125 280 132 S356 91 420 102 S503 64 560 72 S640 32 700 40 L700 210 L0 210 Z"
            />
            <path
              className="chart-line"
              d="M0 182 C55 169 83 144 140 153 S225 125 280 132 S356 91 420 102 S503 64 560 72 S640 32 700 40"
            />
            <g className="chart-points">
              <circle cx="0" cy="182" r="4" />
              <circle cx="140" cy="153" r="4" />
              <circle cx="280" cy="132" r="4" />
              <circle cx="420" cy="102" r="4" />
              <circle cx="560" cy="72" r="4" />
              <circle cx="700" cy="40" r="4" />
            </g>
          </svg>
          <div className="x-axis">
            {t.months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
