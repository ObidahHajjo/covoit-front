/**
 * Formats an ISO-like datetime string as `dd/mm/yyyy hh:mm`.
 *
 * @param value Datetime string to format.
 * @returns A human-readable date and time string, the original value when parsing fails, or an em dash when the value is empty.
 */
export function formatDateTimeRaw(value?: string | null): string {
    if (!value) return "—";

    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
    );

    if (!match) {
        return value;
    }

    const [, year, month, day, hour, minute] = match;

    return `${day}/${month}/${year} ${hour}:${minute}`;
}
