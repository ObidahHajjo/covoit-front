import { formatLocaleDateTime } from "../i18n/config";

/**
 * Formats a date-time string using the active application locale.
 *
 * @param value Datetime string to format.
 * @returns A human-readable date and time string, the original value when parsing fails, or an em dash when the value is empty.
 */
export function formatDateTimeRaw(value?: string | null): string {
    if (!value) return "-";

    return formatLocaleDateTime(value, { dateStyle: "medium", timeStyle: "short" }, value);
}
