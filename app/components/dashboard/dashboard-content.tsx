"use client";

import { Button } from "@heroui/react";
import { Hand, Plus } from "lucide-react";
import { useLanguage } from "../language-provider";
import { ActivityPanel } from "./activity-panel";
import { dashboardCopy } from "./dashboard-copy";
import { ProjectsPanel } from "./projects-panel";
import { RevenueChart } from "./revenue-chart";
import { StatCard } from "./stat-card";

export function DashboardContent() {
  const { language } = useLanguage();
  const t = dashboardCopy[language];

  return (
    <>
      <div className="welcome-row">
        <div>
          <p>{t.welcomeDate}</p>
          <h1>
            {t.welcome} <Hand className="welcome-wave" />
          </h1>
          <span>{t.welcomeText}</span>
        </div>
        <Button variant="primary">
          <Plus /> {t.newProject}
        </Button>
      </div>
      <div className="stats-grid">
        {t.stats.map((item) => (
          <StatCard item={item} options={t.options} key={item.label} />
        ))}
      </div>
      <div className="dashboard-grid">
        <RevenueChart translations={t} />
        <ActivityPanel translations={t} language={language} />
      </div>
      <ProjectsPanel translations={t} language={language} />
    </>
  );
}
