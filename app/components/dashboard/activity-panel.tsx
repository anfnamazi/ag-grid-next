import type { Language } from "../language-provider";
import { Button } from "@heroui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DashboardCopy } from "./dashboard-copy";

type ActivityPanelProps = {
  language: Language;
  translations: DashboardCopy;
};

export function ActivityPanel({
  language,
  translations: t,
}: ActivityPanelProps) {
  const DirectionArrow = language === "fa" ? ArrowLeft : ArrowRight;

  return (
    <section className="panel activity-panel">
      <div className="panel-heading">
        <div>
          <h2>{t.recentActivity}</h2>
          <p>{t.activitySubtitle}</p>
        </div>
        <button type="button" className="text-link">
          {t.viewAll} <DirectionArrow />
        </button>
      </div>
      <div className="activity-list">
        {t.activities.map((item) => (
          <div className="activity" key={item.time}>
            <div className="activity-avatar" style={{ background: item.color }}>
              {item.initials}
            </div>
            <div>
              <p>
                <strong>{item.name}</strong> {item.action}
              </p>
              <span>{item.target}</span>
              <small>{item.time}</small>
            </div>
          </div>
        ))}
      </div>
      <Button fullWidth variant="secondary">
        {t.viewAllActivities}
      </Button>
    </section>
  );
}
