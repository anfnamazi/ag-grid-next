import type { Language } from "../language-provider";

export type NavigationIcon =
  | "dashboard"
  | "projects"
  | "tasks"
  | "team"
  | "reports"
  | "calendar"
  | "settings"
  | "help";

export type NavigationItem = {
  label: string;
  icon: NavigationIcon;
  count?: string;
  href?: string;
};

export type NavigationGroup = {
  title: string;
  items: readonly NavigationItem[];
};

export const shellCopy = {
  fa: {
    brand: "حامیران پنل",
    brandSubtitle: "مدیریت یکپارچه",
    userName: "مهدی نادری",
    userRole: "مدیر محصول",
    userInitials: "من",
    dashboard: "داشبورد",
    overview: "نمای کلی",
    reports: "گزارش‌ها",
    menu: "منوی اصلی",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    searchMenu: "جستجو در منو",
    searchPlaceholder: "جستجو در منو...",
    emptySearch: "نتیجه‌ای پیدا نشد.",
    theme: "تغییر پوسته روشن یا تاریک",
    language: "Switch to English",
    notifications: "اعلان‌ها",
    accountOptions: "گزینه‌های حساب",
    upgradeTitle: "امکانات بیشتر می‌خواهید؟",
    upgradeText: "با ارتقا به نسخه حرفه‌ای، محدودیت‌ها را کنار بگذارید.",
    plans: "مشاهده پلن‌ها",
    navGroups: [
      {
        title: "فضای کاری",
        items: [
          { label: "نمای کلی", icon: "dashboard", href: "/" },
          { label: "پروژه‌ها", icon: "projects", count: "۱۲" },
          { label: "وظایف من", icon: "tasks", count: "۵" },
          { label: "اعضای تیم", icon: "team" },
        ],
      },
      {
        title: "مدیریت",
        items: [
          { label: "گزارش‌ها", icon: "reports", href: "/reports" },
          { label: "تقویم", icon: "calendar" },
        ],
      },
      {
        title: "سیستم",
        items: [
          { label: "تنظیمات", icon: "settings" },
          { label: "راهنما و پشتیبانی", icon: "help" },
        ],
      },
    ] satisfies NavigationGroup[],
  },
  en: {
    brand: "Hamiran Panel",
    brandSubtitle: "Unified Management",
    userName: "Mehdi Naderi",
    userRole: "Product Manager",
    userInitials: "MN",
    dashboard: "Dashboard",
    overview: "Overview",
    reports: "Reports",
    menu: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    searchMenu: "Search navigation",
    searchPlaceholder: "Search menu...",
    emptySearch: "No results found.",
    theme: "Switch light or dark theme",
    language: "تغییر زبان به فارسی",
    notifications: "Notifications",
    accountOptions: "Account options",
    upgradeTitle: "Need more features?",
    upgradeText: "Upgrade to Pro and remove your workspace limits.",
    plans: "View plans",
    navGroups: [
      {
        title: "Workspace",
        items: [
          { label: "Overview", icon: "dashboard", href: "/" },
          { label: "Projects", icon: "projects", count: "12" },
          { label: "My tasks", icon: "tasks", count: "5" },
          { label: "Team members", icon: "team" },
        ],
      },
      {
        title: "Management",
        items: [
          { label: "Reports", icon: "reports", href: "/reports" },
          { label: "Calendar", icon: "calendar" },
        ],
      },
      {
        title: "System",
        items: [
          { label: "Settings", icon: "settings" },
          { label: "Help & support", icon: "help" },
        ],
      },
    ] satisfies NavigationGroup[],
  },
} as const;

export type ShellCopy = (typeof shellCopy)[Language];
