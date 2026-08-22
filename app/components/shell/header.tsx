"use client";

import { Button } from "@heroui/react";
import {
  Bell,
  ChevronLeft,
  Languages,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useLanguage } from "../language-provider";
import { Brand, UserAvatar } from "./brand";
import { shellCopy } from "./shell-copy";

type HeaderProps = {
  currentPage: string;
  onMenu: () => void;
  onTheme: () => void;
};

export function Header({ currentPage, onMenu, onTheme }: HeaderProps) {
  const { language, toggleLanguage } = useLanguage();
  const t = shellCopy[language];

  return (
    <header className="topbar">
      <div className="mobile-brand">
        <Button
          aria-label={t.openMenu}
          isIconOnly
          variant="ghost"
          onPress={onMenu}
        >
          <Menu />
        </Button>
        <Brand />
      </div>
      <div className="topbar-title">
        <span>{t.dashboard}</span>
        <ChevronLeft />
        <strong>{currentPage}</strong>
      </div>
      <div className="header-actions">
        <Button
          aria-label={t.language}
          className="language-button"
          variant="ghost"
          onPress={toggleLanguage}
        >
          <Languages />
          <span>{language === "fa" ? "EN" : "فا"}</span>
        </Button>
        <Button
          aria-label={t.theme}
          className="header-icon-button"
          isIconOnly
          variant="ghost"
          onPress={onTheme}
        >
          <Sun className="theme-sun" />
          <Moon className="theme-moon" />
        </Button>
        <Button
          aria-label={t.notifications}
          className="header-icon-button notification-button"
          isIconOnly
          variant="ghost"
        >
          <Bell />
          <span />
        </Button>
        <div className="header-divider" />
        <button type="button" className="profile-button">
          <UserAvatar />
          <span>
            <strong>{t.userName}</strong>
            <small>{t.userRole}</small>
          </span>
          <ChevronLeft />
        </button>
      </div>
    </header>
  );
}
