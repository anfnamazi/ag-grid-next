"use client";

import { Button, Input } from "@heroui/react";
import {
  CalendarDays,
  ChartNoAxesCombined,
  ChevronLeft,
  CircleHelp,
  Ellipsis,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../language-provider";
import { Brand, UserAvatar } from "./brand";
import {
  shellCopy,
  type NavigationGroup,
  type NavigationIcon,
} from "./shell-copy";

const navigationIcons: Record<NavigationIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  tasks: ListChecks,
  team: Users,
  reports: ChartNoAxesCombined,
  calendar: CalendarDays,
  settings: Settings,
  help: CircleHelp,
};

type SidebarProps = {
  activePath: string;
  onClose: () => void;
};

export function Sidebar({ activePath, onClose }: SidebarProps) {
  const { language, locale } = useLanguage();
  const t = shellCopy[language];
  const navigationGroups: readonly NavigationGroup[] = t.navGroups;
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filteredGroups = normalizedQuery
    ? navigationGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.label.toLocaleLowerCase(locale).includes(normalizedQuery),
          ),
        }))
        .filter((group) => group.items.length)
    : navigationGroups;

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <aside className="sidebar" aria-label={t.menu}>
      <div className="sidebar-brand">
        <Brand />
        <Button
          aria-label={t.closeMenu}
          className="sidebar-close"
          isIconOnly
          variant="ghost"
          onPress={onClose}
        >
          <X />
        </Button>
      </div>
      <div className="search-box">
        <Search className="search-icon" />
        <Input
          ref={searchRef}
          aria-label={t.searchMenu}
          fullWidth
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          variant="secondary"
        />
        <kbd>⌘ K</kbd>
      </div>
      <nav className="nav-groups">
        {filteredGroups.length ? (
          filteredGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <p>{group.title}</p>
              {group.items.map((item) => {
                const NavigationIcon = navigationIcons[item.icon];
                const content = (
                  <>
                    <NavigationIcon />
                    <span>{item.label}</span>
                    {item.count && <span className="nav-count">{item.count}</span>}
                    {activePath === item.href && (
                      <ChevronLeft className="nav-chevron" />
                    )}
                  </>
                );

                return item.href ? (
                  <Link
                    className={`nav-link ${activePath === item.href ? "active" : ""}`}
                    href={item.href}
                    key={item.label}
                    onClick={onClose}
                  >
                    {content}
                  </Link>
                ) : (
                  <button type="button" className="nav-link" key={item.label}>
                    {content}
                  </button>
                );
              })}
            </div>
          ))
        ) : (
          <p className="empty-search">{t.emptySearch}</p>
        )}
      </nav>
      <div className="sidebar-upgrade">
        <span className="spark">
          <Sparkles />
        </span>
        <strong>{t.upgradeTitle}</strong>
        <p>{t.upgradeText}</p>
        <Button fullWidth size="sm" variant="primary">
          {t.plans}
        </Button>
      </div>
      <div className="sidebar-user">
        <UserAvatar />
        <div>
          <strong>{t.userName}</strong>
          <span>{t.userRole}</span>
        </div>
        <Button
          aria-label={t.accountOptions}
          isIconOnly
          size="sm"
          variant="ghost"
        >
          <Ellipsis />
        </Button>
      </div>
    </aside>
  );
}
