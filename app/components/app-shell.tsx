"use client";

import { Avatar, Button, Input } from "@heroui/react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronLeft,
  CircleHelp,
  Ellipsis,
  FolderKanban,
  Hand,
  LayoutDashboard,
  ListChecks,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

type IconName = "dashboard" | "projects" | "tasks" | "team" | "reports" | "calendar" | "settings" | "help";
type NavItem = { label: string; icon: IconName; count?: string; href?: string };
type NavGroup = { title: string; items: NavItem[] };

const navIcons: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  tasks: ListChecks,
  team: Users,
  reports: ChartNoAxesCombined,
  calendar: CalendarDays,
  settings: Settings,
  help: CircleHelp,
};

const navGroups: NavGroup[] = [
  { title: "فضای کاری", items: [
    { label: "نمای کلی", icon: "dashboard", href: "/" }, { label: "پروژه‌ها", icon: "projects", count: "۱۲" },
    { label: "وظایف من", icon: "tasks", count: "۵" }, { label: "اعضای تیم", icon: "team" },
  ]},
  { title: "مدیریت", items: [{ label: "گزارش‌ها", icon: "reports", href: "/reports" }, { label: "تقویم", icon: "calendar" }]},
  { title: "سیستم", items: [{ label: "تنظیمات", icon: "settings" }, { label: "راهنما و پشتیبانی", icon: "help" }]},
];

const stats = [
  { label: "درآمد این ماه", value: "۲۴۸ میلیون", change: "۱۲٫۵٪", note: "نسبت به ماه قبل", color: "violet" },
  { label: "پروژه‌های فعال", value: "۱۲", change: "۳ پروژه", note: "افزوده شده این ماه", color: "blue" },
  { label: "وظایف تکمیل‌شده", value: "۸۴٪", change: "۸٫۲٪", note: "بهبود عملکرد", color: "green" },
  { label: "اعضای تیم", value: "۲۸ نفر", change: "۲ نفر", note: "عضو جدید", color: "orange" },
];

const projects = [
  { name: "طراحی وب‌سایت نوین", client: "شرکت آبان", progress: 78, due: "۲۸ مرداد", color: "#f8b900", initials: "آن" },
  { name: "اپلیکیشن همراه‌بانک", client: "بانک پارسیان", progress: 52, due: "۱۰ شهریور", color: "#2563eb", initials: "پا" },
  { name: "بازطراحی هویت بصری", client: "استودیو دید", progress: 91, due: "۳ شهریور", color: "#059669", initials: "دی" },
];

const activities = [
  { name: "سارا احمدی", action: "یک وظیفه را تکمیل کرد", target: "طراحی صفحه ورود", time: "۱۲ دقیقه پیش", color: "#f8b900", initials: "سا" },
  { name: "امیر رضایی", action: "فایلی به پروژه افزود", target: "راهنمای برند.pdf", time: "۴۵ دقیقه پیش", color: "#2563eb", initials: "ار" },
  { name: "مهسا کریمی", action: "نظر جدیدی ثبت کرد", target: "نسخه نهایی داشبورد", time: "۲ ساعت پیش", color: "#db2777", initials: "مک" },
];

function Brand() {
  return <div className="brand" aria-label="حامیران پنل"><span className="brand-mark" aria-hidden="true"><span/><span/><span/></span><span className="brand-copy"><strong>حامیران پنل</strong><small>مدیریت یکپارچه</small></span></div>;
}

function UserAvatar() {
  return <Avatar size="sm" color="accent" variant="soft"><Avatar.Fallback>من</Avatar.Fallback></Avatar>;
}

function Sidebar({ activePath, onClose }: { activePath: string; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const filteredGroups = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return navGroups;
    return navGroups.map((group) => ({ ...group, items: group.items.filter((item) => item.label.includes(normalized)) })).filter((group) => group.items.length);
  }, [query]);
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

  return <aside className="sidebar" aria-label="منوی اصلی">
    <div className="sidebar-brand"><Brand/><Button aria-label="بستن منو" className="sidebar-close" isIconOnly variant="ghost" onPress={onClose}><X/></Button></div>
    <div className="search-box"><Search className="search-icon"/><Input ref={searchRef} aria-label="جستجو در منو" fullWidth placeholder="جستجو در منو..." value={query} onChange={(event) => setQuery(event.target.value)} variant="secondary"/><kbd>⌘ K</kbd></div>
    <nav className="nav-groups">
      {filteredGroups.length ? filteredGroups.map((group) => <div className="nav-group" key={group.title}>
        <p>{group.title}</p>
        {group.items.map((item) => {
          const NavIcon = navIcons[item.icon];
          const content = <><NavIcon/><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}{activePath === item.href && <ChevronLeft className="nav-chevron"/>}</>;
          return item.href
            ? <Link className={`nav-link ${activePath === item.href ? "active" : ""}`} href={item.href} key={item.label} onClick={onClose}>{content}</Link>
            : <button type="button" className="nav-link" key={item.label}>{content}</button>;
        })}
      </div>) : <p className="empty-search">نتیجه‌ای پیدا نشد.</p>}
    </nav>
    <div className="sidebar-upgrade"><span className="spark"><Sparkles/></span><strong>امکانات بیشتر می‌خواهید؟</strong><p>با ارتقا به نسخه حرفه‌ای، محدودیت‌ها را کنار بگذارید.</p><Button fullWidth size="sm" variant="primary">مشاهده پلن‌ها</Button></div>
    <div className="sidebar-user"><UserAvatar/><div><strong>مهدی نادری</strong><span>مدیر محصول</span></div><Button aria-label="گزینه‌های حساب" isIconOnly size="sm" variant="ghost"><Ellipsis/></Button></div>
  </aside>;
}

function Header({ currentPage, onTheme, onMenu }: { currentPage: string; onTheme: () => void; onMenu: () => void }) {
  return <header className="topbar">
    <div className="mobile-brand"><Button aria-label="باز کردن منو" isIconOnly variant="ghost" onPress={onMenu}><Menu/></Button><Brand/></div>
    <div className="topbar-title"><span>داشبورد</span><ChevronLeft/><strong>{currentPage}</strong></div>
    <div className="header-actions">
      <Button aria-label="تغییر پوسته روشن یا تاریک" className="header-icon-button" isIconOnly variant="ghost" onPress={onTheme}><Sun className="theme-sun"/><Moon className="theme-moon"/></Button>
      <Button aria-label="اعلان‌ها" className="header-icon-button notification-button" isIconOnly variant="ghost"><Bell/><span/></Button>
      <div className="header-divider"/><button type="button" className="profile-button"><UserAvatar/><span><strong>مهدی نادری</strong><small>مدیر محصول</small></span><ChevronLeft/></button>
    </div>
  </header>;
}

function StatCard({ item }: { item: (typeof stats)[number] }) {
  return <article className={`stat-card stat-${item.color}`}><div className="stat-top"><span>{item.label}</span><button aria-label={`گزینه‌های ${item.label}`} type="button"><Ellipsis/></button></div><strong className="stat-value">{item.value}</strong><div className="stat-meta"><span><TrendingUp/>{item.change}</span><small>{item.note}</small></div><div className="stat-decoration"><i/><i/><i/></div></article>;
}

function RevenueChart() {
  return <section className="panel chart-panel">
    <div className="panel-heading"><div><h2>روند درآمد</h2><p>نمایش درآمد ۶ ماه گذشته</p></div><select aria-label="بازه زمانی"><option>۶ ماه اخیر</option><option>۳ ماه اخیر</option><option>امسال</option></select></div>
    <div className="chart-summary"><strong>۱٫۲ میلیارد تومان</strong><span><TrendingUp/> ۱۸٫۲٪ رشد</span></div>
    <div className="chart-wrap"><div className="y-axis"><span>۳۰۰</span><span>۲۲۵</span><span>۱۵۰</span><span>۷۵</span><span>۰</span></div><div className="chart-canvas"><div className="grid-lines"><i/><i/><i/><i/><i/></div>
      <svg viewBox="0 0 700 210" preserveAspectRatio="none" role="img" aria-label="نمودار روند صعودی درآمد در شش ماه گذشته"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8b900" stopOpacity=".28"/><stop offset="1" stopColor="#f8b900" stopOpacity="0"/></linearGradient></defs><path className="chart-area" d="M0 182 C55 169 83 144 140 153 S225 125 280 132 S356 91 420 102 S503 64 560 72 S640 32 700 40 L700 210 L0 210 Z"/><path className="chart-line" d="M0 182 C55 169 83 144 140 153 S225 125 280 132 S356 91 420 102 S503 64 560 72 S640 32 700 40"/><g className="chart-points"><circle cx="0" cy="182" r="4"/><circle cx="140" cy="153" r="4"/><circle cx="280" cy="132" r="4"/><circle cx="420" cy="102" r="4"/><circle cx="560" cy="72" r="4"/><circle cx="700" cy="40" r="4"/></g></svg>
      <div className="x-axis"><span>اسفند</span><span>فروردین</span><span>اردیبهشت</span><span>خرداد</span><span>تیر</span><span>مرداد</span></div></div></div>
  </section>;
}

function ActivityPanel() {
  return <section className="panel activity-panel"><div className="panel-heading"><div><h2>فعالیت‌های اخیر</h2><p>آخرین تغییرات تیم شما</p></div><button type="button" className="text-link">مشاهده همه <ArrowLeft/></button></div><div className="activity-list">
    {activities.map((item) => <div className="activity" key={item.time}><div className="activity-avatar" style={{ background: item.color }}>{item.initials}</div><div><p><strong>{item.name}</strong> {item.action}</p><span>{item.target}</span><small>{item.time}</small></div></div>)}
  </div><Button fullWidth variant="secondary">مشاهده تمام فعالیت‌ها</Button></section>;
}

function ProjectsPanel() {
  return <section className="panel projects-panel"><div className="panel-heading"><div><h2>پروژه‌های فعال</h2><p>وضعیت پروژه‌های در حال اجرا</p></div><button type="button" className="text-link">همه پروژه‌ها <ArrowLeft/></button></div><div className="project-list">
    {projects.map((project) => <article className="project-row" key={project.name}><div className="project-logo" style={{ background: `${project.color}18`, color: project.color }}>{project.initials}</div><div className="project-name"><strong>{project.name}</strong><span>{project.client}</span></div><div className="project-progress"><div><span>پیشرفت</span><strong>{project.progress}٪</strong></div><div className="progress-track"><i style={{ width: `${project.progress}%`, background: project.color }}/></div></div><div className="project-date"><span>موعد تحویل</span><strong>{project.due}</strong></div><div className="project-people"><span>م</span><span>س</span><span>+۳</span></div><Button aria-label={`گزینه‌های ${project.name}`} isIconOnly size="sm" variant="ghost"><Ellipsis/></Button></article>)}
  </div></section>;
}

export function DashboardContent() {
  return <>
    <div className="welcome-row"><div><p>چهارشنبه، ۲۹ مرداد ۱۴۰۵</p><h1>سلام مهدی، روزت بخیر! <Hand className="welcome-wave"/></h1><span>این خلاصه‌ای از وضعیت کسب‌وکارت در امروز است.</span></div><Button variant="primary"><Plus/> ایجاد پروژه جدید</Button></div>
    <div className="stats-grid">{stats.map((item) => <StatCard item={item} key={item.label}/>)}</div><div className="dashboard-grid"><RevenueChart/><ActivityPanel/></div><ProjectsPanel/>
  </>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const currentPage = pathname === "/reports" ? "گزارش‌ها" : "نمای کلی";

  useEffect(() => { const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setSidebarOpen(false); window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, []);
  const toggleTheme = () => { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.classList.toggle("dark", next === "dark"); document.documentElement.dataset.theme = next; localStorage.setItem("hamrah-theme", next); };

  return <div className="app-shell">
    <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true"/>
    <div className={`sidebar-frame ${sidebarOpen ? "open" : ""}`}><Sidebar activePath={pathname} onClose={() => setSidebarOpen(false)}/></div>
    <div className="main-frame"><Header currentPage={currentPage} onTheme={toggleTheme} onMenu={() => setSidebarOpen(true)}/><main className="dashboard">{children}</main></div>
  </div>;
}
