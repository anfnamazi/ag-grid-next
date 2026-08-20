"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Language = "fa" | "en";

type LanguageContextValue = {
  language: Language;
  direction: "rtl" | "ltr";
  locale: "fa-IR" | "en-US";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const languageListeners = new Set<() => void>();

const getLanguageSnapshot = (): Language =>
  document.documentElement.dataset.language === "en" ? "en" : "fa";

const getServerLanguageSnapshot = (): Language => "fa";

const subscribeToLanguage = (listener: () => void) => {
  languageListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "hamrah-language") return;
    const language = event.newValue === "en" ? "en" : "fa";
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    languageListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const updateLanguage = (language: Language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  document.documentElement.dataset.language = language;
  localStorage.setItem("hamrah-language", language);
  languageListeners.forEach((listener) => listener());
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: language === "fa" ? "rtl" : "ltr",
      locale: language === "fa" ? "fa-IR" : "en-US",
      setLanguage: updateLanguage,
      toggleLanguage: () => updateLanguage(language === "fa" ? "en" : "fa"),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
