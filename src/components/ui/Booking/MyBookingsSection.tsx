import { Link } from "react-router-dom";
import type { Trip } from "../../../types/Trip.ts";
import { useI18n } from "../../../i18n/I18nProvider.tsx";
import { formatLocaleDateTime } from "../../../i18n/config.ts";

type Props = {
  bookings: Trip[];
  now?: number;
};

/**
 * Render one booked trip card with status.
 *
 * @param props - Component props for the booking card.
 * @param props.trip - Trip shown in the card.
 * @param props.now - Current timestamp used to decide whether the trip is past.
 * @returns The rendered booking card link.
 */
function TripCard({ trip, now }: { trip: Trip; now: number }) {
  const { t } = useI18n();
  const from = trip.departure_address?.city?.name ?? "-";
  const to = trip.arrival_address?.city?.name ?? "-";
  const date = trip.departure_time ? formatLocaleDateTime(trip.departure_time) : null;
  const isPast = trip.departure_time ? new Date(trip.departure_time).getTime() <= now : false;
  const seats = trip.available_seats;
  const distance = trip.distance_km;
  const driverName = trip.driver
    ? `${trip.driver.first_name ?? ""} ${trip.driver.last_name ?? ""}`.trim()
    : null;

  return (
    <Link
      to={`/bookings/${trip.id}`}
      className="group flex gap-3 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] sm:gap-4 sm:p-5"
    >
      {/* Timeline left rail */}
      <div className="flex flex-col items-center pt-0.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[var(--theme-primary)] bg-[var(--theme-surface)]" />
        <span className="min-h-4 w-px flex-1 bg-[var(--theme-line-strong)]" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--theme-primary)]" />
      </div>

      {/* Content right of timeline */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight text-[var(--theme-ink)]">{from}</p>
          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${isPast ? "border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-muted)]" : "border-[var(--theme-line-strong)] bg-[var(--theme-surface)] text-[var(--theme-muted-strong)]"}`}>
            {isPast ? t("bookings.completed") : t("bookings.booked")}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--theme-muted)]">
          {date ? (
            <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">📅 {date}</span>
          ) : null}
          {driverName ? (
            <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">👤 {driverName}</span>
          ) : null}
          <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">
            💺 {t("bookings.seats", { count: seats, suffix: seats !== 1 ? "s" : "" })}
          </span>
          {distance ? (
            <span className="rounded-md bg-[var(--theme-bg-soft)] px-2 py-1">
              📍 {t("bookings.distance", { km: distance })}
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-sm font-semibold leading-tight text-[var(--theme-ink)]">{to}</p>
      </div>
    </Link>
  );
}

const CURRENT_TIME = Date.now();

/**
 * List the rider's current and past bookings.
 *
 * @param props - Component props for the bookings section.
 * @param props.bookings - Trips booked by the current rider.
 * @param props.now - Current timestamp override used for status calculations.
 * @returns The rendered bookings section.
 */
export function MyBookingsSection({ bookings, now = CURRENT_TIME }: Props) {
  const { t } = useI18n();

  return (
    <section className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 text-[var(--theme-ink)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("bookings.bookedRoutes")}</p>
          <h2 className="mt-2 text-xl font-medium leading-tight text-[var(--theme-ink)]">{t("bookings.ridePlans")}</h2>
        </div>
        <p className="text-sm text-[var(--theme-muted)]">{t("bookings.savedCount", { count: bookings.length, suffix: bookings.length !== 1 ? "s" : "" })}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--theme-surface)] text-3xl">🗓</span>
          <p className="text-xl font-medium text-[var(--theme-ink)]">{t("bookings.none")}</p>
          <p className="text-sm text-[var(--theme-muted)]">{t("bookings.noneBody")}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((trip) => (
            <TripCard key={trip.id} trip={trip} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}
