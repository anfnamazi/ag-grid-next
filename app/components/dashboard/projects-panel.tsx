import { Button } from "@heroui/react";
import { ArrowLeft, ArrowRight, Ellipsis } from "lucide-react";
import type { Language } from "../language-provider";
import type { DashboardCopy } from "./dashboard-copy";

type ProjectsPanelProps = {
  language: Language;
  translations: DashboardCopy;
};

export function ProjectsPanel({
  language,
  translations: t,
}: ProjectsPanelProps) {
  const DirectionArrow = language === "fa" ? ArrowLeft : ArrowRight;

  return (
    <section className="panel projects-panel">
      <div className="panel-heading">
        <div>
          <h2>{t.activeProjects}</h2>
          <p>{t.projectsSubtitle}</p>
        </div>
        <button type="button" className="text-link">
          {t.allProjects} <DirectionArrow />
        </button>
      </div>
      <div className="project-list">
        {t.projects.map((project) => (
          <article className="project-row" key={project.name}>
            <div
              className="project-logo"
              style={{
                background: `${project.color}18`,
                color: project.color,
              }}
            >
              {project.initials}
            </div>
            <div className="project-name">
              <strong>{project.name}</strong>
              <span>{project.client}</span>
            </div>
            <div className="project-progress">
              <div>
                <span>{t.progress}</span>
                <strong>{project.progress}%</strong>
              </div>
              <div className="progress-track">
                <i
                  style={{
                    width: `${project.progress}%`,
                    background: project.color,
                  }}
                />
              </div>
            </div>
            <div className="project-date">
              <span>{t.dueDate}</span>
              <strong>{project.due}</strong>
            </div>
            <div className="project-people">
              <span>M</span>
              <span>S</span>
              <span>{t.morePeople}</span>
            </div>
            <Button
              aria-label={`${t.options} ${project.name}`}
              isIconOnly
              size="sm"
              variant="ghost"
            >
              <Ellipsis />
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
