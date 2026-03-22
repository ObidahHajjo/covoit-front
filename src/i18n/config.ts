import { dictionaries } from "./dictionaries";

export const LANGUAGE_STORAGE_KEY = "covoit.language";
export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

type TranslationValues = Record<string, string | number>;

function isSupportedLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function getLocaleDirection(locale: AppLocale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

function applyLocaleToDocument(locale: AppLocale) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = locale;
  document.documentElement.dir = getLocaleDirection(locale);
}

export function normalizeLocale(value?: string | null): AppLocale {
  if (!value) {
    return "en";
  }

  const short = value.toLowerCase().split("-")[0];
  return isSupportedLocale(short) ? short : "en";
}

function resolveBrowserLocale(): AppLocale {
  if (typeof window === "undefined") {
    return "en";
  }

  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  for (const language of languages) {
    const locale = normalizeLocale(language);
    if (locale) {
      return locale;
    }
  }

  return "en";
}

export function resolveInitialLocale(): AppLocale {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored ? normalizeLocale(stored) : resolveBrowserLocale();
}

let currentLocale: AppLocale = resolveInitialLocale();

if (typeof window !== "undefined") {
  applyLocaleToDocument(currentLocale);
}

export function getCurrentLocale(): AppLocale {
  return currentLocale;
}

export function setCurrentLocale(locale: AppLocale): AppLocale {
  currentLocale = normalizeLocale(locale);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLocale);
    applyLocaleToDocument(currentLocale);
  }

  return currentLocale;
}

export function translate(key: string, values?: TranslationValues, locale: AppLocale = getCurrentLocale()): string {
  const template = dictionaries[locale][key as keyof (typeof dictionaries)[typeof locale]]
    ?? dictionaries.en[key as keyof typeof dictionaries.en]
    ?? key;

  if (!values) {
    return template;
  }

  let message = String(template);

  for (const [token, value] of Object.entries(values)) {
    message = message.replaceAll(`{${token}}`, String(value));
  }

  return message;
}

export function getIntlLocale(locale: AppLocale = getCurrentLocale()): string {
  if (locale === "fr") {
    return "fr-FR";
  }

  if (locale === "ar") {
    return "ar";
  }

  return "en-US";
}

function toDate(value?: string | Date | null): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLocaleDateTime(
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
  fallback = "-",
  locale: AppLocale = getCurrentLocale(),
): string {
  const date = toDate(value);

  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(date);
}

export function formatLocaleTime(
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
  fallback?: string,
  locale: AppLocale = getCurrentLocale(),
): string {
  const date = toDate(value);

  if (!date) {
    return fallback ?? translate("common.now", undefined, locale);
  }

  return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(date);
}
