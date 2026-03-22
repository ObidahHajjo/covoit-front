import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  formatLocaleDateTime,
  formatLocaleTime,
  getCurrentLocale,
  setCurrentLocale,
  translate,
  type AppLocale,
} from "./config";

type TranslationValues = Record<string, string | number>;

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string, values?: TranslationValues) => string;
  formatDateTime: (value?: string | Date | null, options?: Intl.DateTimeFormatOptions, fallback?: string) => string;
  formatTime: (value?: string | Date | null, options?: Intl.DateTimeFormatOptions, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => getCurrentLocale());

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        const normalized = setCurrentLocale(nextLocale);
        setLocaleState(normalized);
      },
      t: (key, values) => translate(key, values, locale),
      formatDateTime: (value, options, fallback) => formatLocaleDateTime(value, options, fallback, locale),
      formatTime: (value, options, fallback) => formatLocaleTime(value, options, fallback, locale),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
