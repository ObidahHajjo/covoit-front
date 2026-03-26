import { dictionaries } from "./dictionaries";
import { PARIS_TIME_ZONE } from "../utils/parisDateTime";

/**
 * Local-storage key used to persist the selected locale.
 */
export const LANGUAGE_STORAGE_KEY = "covoit.language";

/**
 * Ordered list of locales supported by the frontend.
 */
export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const;

/**
 * Locale codes supported throughout the application.
 */
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Placeholder values injected into translated message templates.
 */
type TranslationValues = Record<string, string | number>;

/**
 * Checks whether a raw locale string is part of the supported locale list.
 *
 * @param value - Locale candidate to validate.
 * @returns `true` when the locale is supported by the app.
 */
function isSupportedLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

/**
 * Resolve the writing direction for a locale.
 *
 * @param locale - Locale to inspect.
 * @returns `"rtl"` for Arabic, otherwise `"ltr"`.
 */
export function getLocaleDirection(locale: AppLocale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Applies locale metadata to the root document element.
 *
 * @param locale - Locale whose language and direction should be reflected in the document.
 * @returns Nothing.
 */
function applyLocaleToDocument(locale: AppLocale) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = locale;
  document.documentElement.dir = getLocaleDirection(locale);
}

/**
 * Normalizes a locale string into one of the app-supported locale codes.
 *
 * @param value - Raw locale string from storage, browser settings, or URL state.
 * @returns A supported locale code, defaulting to `"en"` when no match is found.
 */
export function normalizeLocale(value?: string | null): AppLocale {
  if (!value) {
    return "en";
  }

  const short = value.toLowerCase().split("-")[0];
  return isSupportedLocale(short) ? short : "en";
}

/**
 * Resolves the best locale candidate from the browser language list.
 *
 * @returns The first supported browser locale, or `"en"` as a fallback.
 */
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

/**
 * Resolve the locale that should be used on first load.
 *
 * @returns The stored locale when available, otherwise the browser locale fallback.
 */
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

/**
 * Read the locale currently cached by the i18n module.
 *
 * @returns The active application locale.
 */
export function getCurrentLocale(): AppLocale {
  return currentLocale;
}

/**
 * Persist and apply a new current locale.
 *
 * @param locale - Locale selected by the user.
 * @returns The normalized locale that was applied.
 */
export function setCurrentLocale(locale: AppLocale): AppLocale {
  currentLocale = normalizeLocale(locale);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLocale);
    applyLocaleToDocument(currentLocale);
  }

  return currentLocale;
}

/**
 * Translate a dictionary key with optional token replacement.
 *
 * @param key - Translation key to resolve.
 * @param values - Optional token values used for placeholder replacement.
 * @param locale - Locale to read from. Defaults to the current locale.
 * @returns The resolved translated string, or the key when no translation exists.
 */
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

/**
 * Map an app locale to an `Intl` locale identifier.
 *
 * @param locale - Application locale to convert.
 * @returns The matching locale tag for `Intl` formatters.
 */
export function getIntlLocale(locale: AppLocale = getCurrentLocale()): string {
  if (locale === "fr") {
    return "fr-FR";
  }

  if (locale === "ar") {
    return "ar";
  }

  return "en-US";
}

/**
 * Converts a raw date input into a valid `Date` instance when possible.
 *
 * @param value - Date-like value to parse.
 * @returns A valid `Date`, or `null` when parsing fails.
 */
function toDate(value?: string | Date | null): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Format a date-time value for the active locale.
 *
 * @param value - Raw date value to format.
 * @param options - Optional `Intl.DateTimeFormat` options.
 * @param fallback - Text returned when the value cannot be parsed.
 * @param locale - Locale used to format the value.
 * @returns The localized formatted date-time string.
 */
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

  return new Intl.DateTimeFormat(getIntlLocale(locale), { timeZone: PARIS_TIME_ZONE, ...options }).format(date);
}

/**
 * Format a time value for the active locale.
 *
 * @param value - Raw date value whose time portion should be shown.
 * @param options - Optional `Intl.DateTimeFormat` options.
 * @param fallback - Text returned when the value cannot be parsed.
 * @param locale - Locale used to format the value.
 * @returns The localized formatted time string.
 */
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

  return new Intl.DateTimeFormat(getIntlLocale(locale), { timeZone: PARIS_TIME_ZONE, ...options }).format(date);
}
