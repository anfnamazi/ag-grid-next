"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useLanguage } from "../language-provider";
import { Header } from "./header";
import { shellCopy } from "./shell-copy";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const t = shellCopy[language];
  const currentPage = pathname === "/reports" ? t.reports : t.overview;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const toggleTheme = () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("hamrah-theme", nextTheme);
  };

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className={`sidebar-frame ${sidebarOpen ? "open" : ""}`}>
        <Sidebar
          activePath={pathname}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      <div className="main-frame">
        <Header
          currentPage={currentPage}
          onTheme={toggleTheme}
          onMenu={() => setSidebarOpen(true)}
        />
        <main className="dashboard">{children}</main>
      </div>
    </div>
  );
}
