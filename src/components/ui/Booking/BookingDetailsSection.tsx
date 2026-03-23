import type { Person } from "../../../types/Person.ts";
import type { Trip } from "../../../types/Trip.ts";
import FloatingToast from "../../common/FloatingToast.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";
import { formatLocaleDateTime } from "../../../i18n/config.ts";

type Props = {
  trip: Trip;
  passengers: Person[];
  isTripEnded: boolean;
  cancelling: boolean;
  error: string | null;
  onCancel: () => void;
  onContactDriver: () => void;
};

/**
 * Display a labeled booking detail value.
 *
 * @param props - Component props for the detail card.
 * @param props.label - Label describing the value.
 * @param props.value - Text value shown for the detail.
 * @returns The rendered detail card.
 */
function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-[var(--theme-ink)]">{value}</p>
    </div>
  );
}

/**
 * Present the passenger view of a booked trip.
 *
 * @param props - Component props for the booking-details screen.
 * @param props.trip - Trip associated with the booking.
 * @param props.passengers - Passenger list attached to the trip.
 * @param props.isTripEnded - Whether the trip has already finished.
 * @param props.cancelling - Whether a cancellation request is currently in progress.
 * @param props.error - Optional error message shown in a toast.
 * @param props.onCancel - Callback fired when the rider cancels the reservation.
 * @param props.onContactDriver - Callback fired when the rider wants to message the driver.
 * @returns The rendered booking-details section.
 */
export function BookingDetailsSection({
  trip,
  passengers,
  isTripEnded,
  cancelling,
  error,
  onCancel,
  onContactDriver,
}: Props) {
  const { t } = useI18n();
  const from = trip.departure_address?.city?.name ?? "-";
  const to = trip.arrival_address?.city?.name ?? "-";
  const departurePoint = [trip.departure_address?.street_number, trip.departure_address?.street, trip.departure_address?.city?.postal_code, trip.departure_address?.city?.name]
    .filter(Boolean)
    .join(" ");
  const arrivalPoint = [trip.arrival_address?.street_number, trip.arrival_address?.street, trip.arrival_address?.city?.postal_code, trip.arrival_address?.city?.name]
    .filter(Boolean)
    .join(" ");
  const departureDate = trip.departure_time
    ? formatLocaleDateTime(trip.departure_time)
    : t("common.dateUnavailable");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
      <FloatingToast tone="error" message={error} durationMs={6500} />
      <section className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 text-[var(--theme-ink)] sm:px-7 sm:py-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("bookings.details")}</p>
        <h1 className="mt-3 text-2xl font-medium leading-tight text-[var(--theme-ink)] sm:text-3xl">{from} - {to}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("bookings.detailsBody")}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <DetailCard label={t("trip.departure")} value={departureDate} />
          <DetailCard label={t("bookings.passengers")} value={t("bookings.personCount", { count: passengers.length, label: passengers.length === 1 ? t("bookings.person") : t("bookings.people") })} />
          <DetailCard label={t("trip.departureAddress")} value={departurePoint || t("common.addressUnavailable")} />
          <DetailCard label={t("trip.arrivalAddress")} value={arrivalPoint || t("common.addressUnavailable")} />
          <DetailCard label={t("trip.distance")} value={`${trip.distance_km} km`} />
          <DetailCard label={t("trip.rideStyle")} value={trip.smoking_allowed ? t("trip.smokingAllowed") : t("trip.nonSmoking")} />
        </div>

        <div className="mt-8 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
               <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("bookings.reservationStatus")}</p>
               <h2 className="mt-2 text-xl font-medium text-[var(--theme-ink)]">{isTripEnded ? t("bookings.rideWrapped") : t("bookings.rideReserved")}</h2>
             </div>
             <span className={`rounded-full border px-3 py-1 text-xs font-medium ${isTripEnded ? "border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-[var(--theme-muted)]" : "border-[var(--theme-line-strong)] bg-[var(--theme-surface)] text-[var(--theme-muted-strong)]"}`}>
               {isTripEnded ? t("bookings.ended") : t("bookings.active")}
             </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={onContactDriver}
              className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-3.5 text-sm font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] hover:bg-[var(--theme-surface)]"
            >
              {t("trip.contactDriver")}
            </button>

            {!isTripEnded ? (
              <button
                onClick={onCancel}
                disabled={cancelling}
                className="rounded-lg bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:opacity-40"
              >
                 {cancelling ? t("bookings.cancelling") : t("bookings.cancelReservation")}
               </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
