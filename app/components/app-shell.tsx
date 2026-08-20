"use client";

import { Avatar, Button, Input } from "@heroui/react";
import {
  ArrowLeft, ArrowRight, Bell, CalendarDays, ChartNoAxesCombined, ChevronLeft,
  CircleHelp, Ellipsis, FolderKanban, Hand, Languages, LayoutDashboard,
  ListChecks, Menu, Moon, Plus, Search, Settings, Sparkles, Sun, TrendingUp,
  Users, X, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type Language, useLanguage } from "./language-provider";

type IconName = "dashboard" | "projects" | "tasks" | "team" | "reports" | "calendar" | "settings" | "help";
type NavItem = { label: string; icon: IconName; count?: string; href?: string };
type NavGroup = { title: string; items: readonly NavItem[] };

const navIcons: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard, projects: FolderKanban, tasks: ListChecks,
  team: Users, reports: ChartNoAxesCombined, calendar: CalendarDays,
  settings: Settings, help: CircleHelp,
};

const shellCopy = {
  fa: {
    brand: "حامیران پنل", brandSubtitle: "مدیریت یکپارچه", userName: "مهدی نادری",
    userRole: "مدیر محصول", userInitials: "من", dashboard: "داشبورد", overview: "نمای کلی",
    reports: "گزارش‌ها", menu: "منوی اصلی", openMenu: "باز کردن منو", closeMenu: "بستن منو",
    searchMenu: "جستجو در منو", searchPlaceholder: "جستجو در منو...", emptySearch: "نتیجه‌ای پیدا نشد.",
    theme: "تغییر پوسته روشن یا تاریک", language: "Switch to English", notifications: "اعلان‌ها",
    accountOptions: "گزینه‌های حساب", upgradeTitle: "امکانات بیشتر می‌خواهید؟",
    upgradeText: "با ارتقا به نسخه حرفه‌ای، محدودیت‌ها را کنار بگذارید.", plans: "مشاهده پلن‌ها",
    navGroups: [
      { title: "فضای کاری", items: [
        { label: "نمای کلی", icon: "dashboard", href: "/" },
        { label: "پروژه‌ها", icon: "projects", count: "۱۲" },
        { label: "وظایف من", icon: "tasks", count: "۵" },
        { label: "اعضای تیم", icon: "team" },
      ] },
      { title: "مدیریت", items: [
        { label: "گزارش‌ها", icon: "reports", href: "/reports" },
        { label: "تقویم", icon: "calendar" },
      ] },
      { title: "سیستم", items: [
        { label: "تنظیمات", icon: "settings" },
        { label: "راهنما و پشتیبانی", icon: "help" },
      ] },
    ] satisfies NavGroup[],
    welcomeDate: "پنجشنبه، ۲۹ مرداد ۱۴۰۵", welcome: "سلام مهدی، روزت بخیر!",
    welcomeText: "این خلاصه‌ای از وضعیت کسب‌وکارت در امروز است.", newProject: "ایجاد پروژه جدید",
    stats: [
      { label: "درآمد این ماه", value: "۲۴۸ میلیون", change: "۱۲٫۵٪", note: "نسبت به ماه قبل", color: "violet" },
      { label: "پروژه‌های فعال", value: "۱۲", change: "۳ پروژه", note: "افزوده شده این ماه", color: "blue" },
      { label: "وظایف تکمیل‌شده", value: "۸۴٪", change: "۸٫۲٪", note: "بهبود عملکرد", color: "green" },
      { label: "اعضای تیم", value: "۲۸ نفر", change: "۲ نفر", note: "عضو جدید", color: "orange" },
    ],
    revenueTitle: "روند درآمد", revenueSubtitle: "نمایش درآمد ۶ ماه گذشته", revenueValue: "۱٫۲ میلیارد تومان",
    revenueGrowth: "۱۸٫۲٪ رشد", ranges: ["۶ ماه اخیر", "۳ ماه اخیر", "امسال"], rangeLabel: "بازه زمانی",
    chartLabel: "نمودار روند صعودی درآمد در شش ماه گذشته", months: ["اسفند", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد"],
    recentActivity: "فعالیت‌های اخیر", activitySubtitle: "آخرین تغییرات تیم شما", viewAll: "مشاهده همه",
    viewAllActivities: "مشاهده تمام فعالیت‌ها", activities: [
      { name: "سارا احمدی", action: "یک وظیفه را تکمیل کرد", target: "طراحی صفحه ورود", time: "۱۲ دقیقه پیش", color: "#f8b900", initials: "سا" },
      { name: "امیر رضایی", action: "فایلی به پروژه افزود", target: "راهنمای برند.pdf", time: "۴۵ دقیقه پیش", color: "#2563eb", initials: "ار" },
      { name: "مهسا کریمی", action: "نظر جدیدی ثبت کرد", target: "نسخه نهایی داشبورد", time: "۲ ساعت پیش", color: "#db2777", initials: "مک" },
    ],
    activeProjects: "پروژه‌های فعال", projectsSubtitle: "وضعیت پروژه‌های در حال اجرا", allProjects: "همه پروژه‌ها",
    progress: "پیشرفت", dueDate: "موعد تحویل", options: "گزینه‌های", projects: [
      { name: "طراحی وب‌سایت نوین", client: "شرکت آبان", progress: 78, due: "۲۸ مرداد", color: "#f8b900", initials: "آن" },
      { name: "اپلیکیشن همراه‌بانک", client: "بانک پارسیان", progress: 52, due: "۱۰ شهریور", color: "#2563eb", initials: "پا" },
      { name: "بازطراحی هویت بصری", client: "استودیو دید", progress: 91, due: "۳ شهریور", color: "#059669", initials: "دی" },
    ], morePeople: "+۳",
  },
  en: {
    brand: "Hamiran Panel", brandSubtitle: "Unified Management", userName: "Mehdi Naderi",
    userRole: "Product Manager", userInitials: "MN", dashboard: "Dashboard", overview: "Overview",
    reports: "Reports", menu: "Main navigation", openMenu: "Open menu", closeMenu: "Close menu",
    searchMenu: "Search navigation", searchPlaceholder: "Search menu...", emptySearch: "No results found.",
    theme: "Switch light or dark theme", language: "تغییر زبان به فارسی", notifications: "Notifications",
    accountOptions: "Account options", upgradeTitle: "Need more features?",
    upgradeText: "Upgrade to Pro and remove your workspace limits.", plans: "View plans",
    navGroups: [
      { title: "Workspace", items: [
        { label: "Overview", icon: "dashboard", href: "/" },
        { label: "Projects", icon: "projects", count: "12" },
        { label: "My tasks", icon: "tasks", count: "5" },
        { label: "Team members", icon: "team" },
      ] },
      { title: "Management", items: [
        { label: "Reports", icon: "reports", href: "/reports" },
        { label: "Calendar", icon: "calendar" },
      ] },
      { title: "System", items: [
        { label: "Settings", icon: "settings" },
        { label: "Help & support", icon: "help" },
      ] },
    ] satisfies NavGroup[],
    welcomeDate: "Thursday, August 20, 2026", welcome: "Good day, Mehdi!",
    welcomeText: "Here is a summary of your business today.", newProject: "Create new project",
    stats: [
      { label: "Revenue this month", value: "248M", change: "12.5%", note: "vs. last month", color: "violet" },
      { label: "Active projects", value: "12", change: "3 projects", note: "added this month", color: "blue" },
      { label: "Completed tasks", value: "84%", change: "8.2%", note: "performance increase", color: "green" },
      { label: "Team members", value: "28", change: "2 people", note: "new members", color: "orange" },
    ],
    revenueTitle: "Revenue trend", revenueSubtitle: "Revenue over the past 6 months", revenueValue: "IRR 1.2 billion",
    revenueGrowth: "18.2% growth", ranges: ["Last 6 months", "Last 3 months", "This year"], rangeLabel: "Time range",
    chartLabel: "Upward revenue trend over the past six months", months: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    recentActivity: "Recent activity", activitySubtitle: "Latest changes from your team", viewAll: "View all",
    viewAllActivities: "View all activities", activities: [
      { name: "Sara Ahmadi", action: "completed a task", target: "Login page design", time: "12 minutes ago", color: "#f8b900", initials: "SA" },
      { name: "Amir Rezaei", action: "added a project file", target: "brand-guide.pdf", time: "45 minutes ago", color: "#2563eb", initials: "AR" },
      { name: "Mahsa Karimi", action: "added a comment", target: "Final dashboard", time: "2 hours ago", color: "#db2777", initials: "MK" },
    ],
    activeProjects: "Active projects", projectsSubtitle: "Status of projects in progress", allProjects: "All projects",
    progress: "Progress", dueDate: "Due date", options: "Options for", projects: [
      { name: "Novin website design", client: "Aban Co.", progress: 78, due: "Aug 19", color: "#f8b900", initials: "NO" },
      { name: "Mobile banking app", client: "Parsian Bank", progress: 52, due: "Sep 1", color: "#2563eb", initials: "PB" },
      { name: "Visual identity redesign", client: "Did Studio", progress: 91, due: "Aug 25", color: "#059669", initials: "DS" },
    ], morePeople: "+3",
  },
} as const;

function Brand() {
  const { language } = useLanguage();
  const t = shellCopy[language];
  return <div className="brand" aria-label={t.brand}><span className="brand-mark" aria-hidden="true"><span/><span/><span/></span><span className="brand-copy"><strong>{t.brand}</strong><small>{t.brandSubtitle}</small></span></div>;
}

function UserAvatar() {
  const { language } = useLanguage();
  return <Avatar size="sm" color="accent" variant="soft"><Avatar.Fallback>{shellCopy[language].userInitials}</Avatar.Fallback></Avatar>;
}

function Sidebar({ activePath, onClose }: { activePath: string; onClose: () => void }) {
  const { language } = useLanguage();
  const t = shellCopy[language];
  const navGroups: readonly NavGroup[] = t.navGroups;
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filteredGroups = normalizedQuery
    ? navGroups.map((group) => ({ ...group, items: group.items.filter((item) => item.label.toLocaleLowerCase(locale).includes(normalizedQuery)) })).filter((group) => group.items.length)
    : navGroups;

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return <aside className="sidebar" aria-label={t.menu}>
    <div className="sidebar-brand"><Brand/><Button aria-label={t.closeMenu} className="sidebar-close" isIconOnly variant="ghost" onPress={onClose}><X/></Button></div>
    <div className="search-box"><Search className="search-icon"/><Input ref={searchRef} aria-label={t.searchMenu} fullWidth placeholder={t.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} variant="secondary"/><kbd>⌘ K</kbd></div>
    <nav className="nav-groups">{filteredGroups.length ? filteredGroups.map((group) => <div className="nav-group" key={group.title}>
      <p>{group.title}</p>{group.items.map((item) => { const NavIcon = navIcons[item.icon]; const content = <><NavIcon/><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}{activePath === item.href && <ChevronLeft className="nav-chevron"/>}</>; return item.href ? <Link className={`nav-link ${activePath === item.href ? "active" : ""}`} href={item.href} key={item.label} onClick={onClose}>{content}</Link> : <button type="button" className="nav-link" key={item.label}>{content}</button>; })}
    </div>) : <p className="empty-search">{t.emptySearch}</p>}</nav>
    <div className="sidebar-upgrade"><span className="spark"><Sparkles/></span><strong>{t.upgradeTitle}</strong><p>{t.upgradeText}</p><Button fullWidth size="sm" variant="primary">{t.plans}</Button></div>
    <div className="sidebar-user"><UserAvatar/><div><strong>{t.userName}</strong><span>{t.userRole}</span></div><Button aria-label={t.accountOptions} isIconOnly size="sm" variant="ghost"><Ellipsis/></Button></div>
  </aside>;
}

function Header({ currentPage, onTheme, onMenu }: { currentPage: string; onTheme: () => void; onMenu: () => void }) {
  const { language, toggleLanguage } = useLanguage();
  const t = shellCopy[language];
  return <header className="topbar">
    <div className="mobile-brand"><Button aria-label={t.openMenu} isIconOnly variant="ghost" onPress={onMenu}><Menu/></Button><Brand/></div>
    <div className="topbar-title"><span>{t.dashboard}</span><ChevronLeft/><strong>{currentPage}</strong></div>
    <div className="header-actions"><Button aria-label={t.language} className="language-button" variant="ghost" onPress={toggleLanguage}><Languages/><span>{language === "fa" ? "EN" : "فا"}</span></Button><Button aria-label={t.theme} className="header-icon-button" isIconOnly variant="ghost" onPress={onTheme}><Sun className="theme-sun"/><Moon className="theme-moon"/></Button><Button aria-label={t.notifications} className="header-icon-button notification-button" isIconOnly variant="ghost"><Bell/><span/></Button><div className="header-divider"/><button type="button" className="profile-button"><UserAvatar/><span><strong>{t.userName}</strong><small>{t.userRole}</small></span><ChevronLeft/></button></div>
  </header>;
}

type DashboardCopy = (typeof shellCopy)[Language];
type StatItem = DashboardCopy["stats"][number];

function StatCard({ item, options }: { item: StatItem; options: string }) {
  return <article className={`stat-card stat-${item.color}`}><div className="stat-top"><span>{item.label}</span><button aria-label={`${options} ${item.label}`} type="button"><Ellipsis/></button></div><strong className="stat-value">{item.value}</strong><div className="stat-meta"><span><TrendingUp/>{item.change}</span><small>{item.note}</small></div><div className="stat-decoration"><i/><i/><i/></div></article>;
}

function RevenueChart({ t }: { t: DashboardCopy }) {
  return <section className="panel chart-panel"><div className="panel-heading"><div><h2>{t.revenueTitle}</h2><p>{t.revenueSubtitle}</p></div><select aria-label={t.rangeLabel}>{t.ranges.map((range) => <option key={range}>{range}</option>)}</select></div><div className="chart-summary"><strong>{t.revenueValue}</strong><span><TrendingUp/> {t.revenueGrowth}</span></div><div className="chart-wrap"><div className="y-axis"><span>300</span><span>225</span><span>150</span><span>75</span><span>0</span></div><div className="chart-canvas"><div className="grid-lines"><i/><i/><i/><i/><i/></div><svg viewBox="0 0 700 210" preserveAspectRatio="none" role="img" aria-label={t.chartLabel}><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8b900" stopOpacity=".28"/><stop offset="1" stopColor="#f8b900" stopOpacity="0"/></linearGradient></defs><path className="chart-area" d="M0 182 C55 169 83 144 140 153 S225 125 280 132 S356 91 420 102 S503 64 560 72 S640 32 700 40 L700 210 L0 210 Z"/><path className="chart-line" d="M0 182 C55 169 83 144 140 153 S225 125 280 132 S356 91 420 102 S503 64 560 72 S640 32 700 40"/><g className="chart-points"><circle cx="0" cy="182" r="4"/><circle cx="140" cy="153" r="4"/><circle cx="280" cy="132" r="4"/><circle cx="420" cy="102" r="4"/><circle cx="560" cy="72" r="4"/><circle cx="700" cy="40" r="4"/></g></svg><div className="x-axis">{t.months.map((month) => <span key={month}>{month}</span>)}</div></div></div></section>;
}

function ActivityPanel({ t, language }: { t: DashboardCopy; language: Language }) {
  const DirectionArrow = language === "fa" ? ArrowLeft : ArrowRight;
  return <section className="panel activity-panel"><div className="panel-heading"><div><h2>{t.recentActivity}</h2><p>{t.activitySubtitle}</p></div><button type="button" className="text-link">{t.viewAll} <DirectionArrow/></button></div><div className="activity-list">{t.activities.map((item) => <div className="activity" key={item.time}><div className="activity-avatar" style={{ background: item.color }}>{item.initials}</div><div><p><strong>{item.name}</strong> {item.action}</p><span>{item.target}</span><small>{item.time}</small></div></div>)}</div><Button fullWidth variant="secondary">{t.viewAllActivities}</Button></section>;
}

function ProjectsPanel({ t, language }: { t: DashboardCopy; language: Language }) {
  const DirectionArrow = language === "fa" ? ArrowLeft : ArrowRight;
  return <section className="panel projects-panel"><div className="panel-heading"><div><h2>{t.activeProjects}</h2><p>{t.projectsSubtitle}</p></div><button type="button" className="text-link">{t.allProjects} <DirectionArrow/></button></div><div className="project-list">{t.projects.map((project) => <article className="project-row" key={project.name}><div className="project-logo" style={{ background: `${project.color}18`, color: project.color }}>{project.initials}</div><div className="project-name"><strong>{project.name}</strong><span>{project.client}</span></div><div className="project-progress"><div><span>{t.progress}</span><strong>{project.progress}%</strong></div><div className="progress-track"><i style={{ width: `${project.progress}%`, background: project.color }}/></div></div><div className="project-date"><span>{t.dueDate}</span><strong>{project.due}</strong></div><div className="project-people"><span>M</span><span>S</span><span>{t.morePeople}</span></div><Button aria-label={`${t.options} ${project.name}`} isIconOnly size="sm" variant="ghost"><Ellipsis/></Button></article>)}</div></section>;
}

export function DashboardContent() {
  const { language } = useLanguage();
  const t = shellCopy[language];
  return <><div className="welcome-row"><div><p>{t.welcomeDate}</p><h1>{t.welcome} <Hand className="welcome-wave"/></h1><span>{t.welcomeText}</span></div><Button variant="primary"><Plus/> {t.newProject}</Button></div><div className="stats-grid">{t.stats.map((item) => <StatCard item={item} options={t.options} key={item.label}/>)}</div><div className="dashboard-grid"><RevenueChart t={t}/><ActivityPanel t={t} language={language}/></div><ProjectsPanel t={t} language={language}/></>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const t = shellCopy[language];
  const currentPage = pathname === "/reports" ? t.reports : t.overview;
  useEffect(() => { const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setSidebarOpen(false); window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, []);
  const toggleTheme = () => { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.classList.toggle("dark", next === "dark"); document.documentElement.dataset.theme = next; localStorage.setItem("hamrah-theme", next); };
  return <div className="app-shell"><div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true"/><div className={`sidebar-frame ${sidebarOpen ? "open" : ""}`}><Sidebar activePath={pathname} onClose={() => setSidebarOpen(false)}/></div><div className="main-frame"><Header currentPage={currentPage} onTheme={toggleTheme} onMenu={() => setSidebarOpen(true)}/><main className="dashboard">{children}</main></div></div>;
}
