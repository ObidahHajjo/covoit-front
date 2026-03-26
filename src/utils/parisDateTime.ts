export const PARIS_TIME_ZONE = "Europe/Paris";

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function getParisParts(value: string | Date): DateParts | null {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const lookup = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? NaN);

  const extracted = {
    year: lookup("year"),
    month: lookup("month"),
    day: lookup("day"),
    hour: lookup("hour"),
    minute: lookup("minute"),
  };

  return Object.values(extracted).some((part) => Number.isNaN(part)) ? null : extracted;
}

function getParisOffsetMinutes(date: Date): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS_TIME_ZONE,
    timeZoneName: "longOffset",
    hour: "2-digit",
  });

  const zoneName = formatter.formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? "GMT+00:00";
  const match = zoneName.match(/GMT([+-])(\d{1,2}):(\d{2})/);

  if (!match) {
    return 0;
  }

  const [, sign, hours, minutes] = match;
  const totalMinutes = Number(hours) * 60 + Number(minutes);
  return sign === "-" ? -totalMinutes : totalMinutes;
}

export function formatDateTimeForParisInput(value?: string | Date | null): string {
  if (!value) {
    return "";
  }

  const parts = getParisParts(value);
  if (!parts) {
    return "";
  }

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function getCurrentParisDateTimeInput(): string {
  return formatDateTimeForParisInput(new Date());
}

export function parisInputToIsoString(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    return value;
  }

  const [, year, month, day, hour, minute] = match;
  const utcGuess = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));

  let offsetMinutes = getParisOffsetMinutes(new Date(utcGuess));
  let timestamp = utcGuess - offsetMinutes * 60_000;

  const correctedOffsetMinutes = getParisOffsetMinutes(new Date(timestamp));
  if (correctedOffsetMinutes !== offsetMinutes) {
    offsetMinutes = correctedOffsetMinutes;
    timestamp = utcGuess - offsetMinutes * 60_000;
  }

  return new Date(timestamp).toISOString();
}
