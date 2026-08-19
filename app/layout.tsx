import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "حامیران پنل | داشبورد مدیریت",
    template: "%s | حامیران پنل",
  },
  description: "پنل مدیریت فارسی، راست‌چین و واکنش‌گرا با Next.js و HeroUI",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem("hamrah-theme");
    const theme = savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
