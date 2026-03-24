import { formatDateTimeRaw } from "../../../helpers/FormatDateTime.ts";
import type { Person } from "../../../types/Person.ts";
import type { Trip } from "../../../types/Trip.ts";
import FloatingToast from "../../common/FloatingToast.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";

/**
 * Show a grouped set of trip facts inside the driver view.
 *
 * @param props - Component props describing the info card content.
 * @param props.icon - Icon displayed for the card section.
 * @param props.title - Section title.
 * @param props.rows - Key-value rows rendered inside the card.
 * @returns The rendered info card.
 */
function InfoCard({ icon, title, rows }: {
  icon: string;
  title: string;
  rows: { label: string; value: string | number | undefined | null }[];
}) {
  return (
    <div className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-sm">{icon}</span>
        <h3 className="text-base font-medium text-[var(--theme-ink)]">{title}</h3>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">{label}</span>
            <span className="text-right text-sm text-[var(--theme-ink)]">{value ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Render one passenger entry with a contact action.
 *
 * @param props - Component props for the passenger row.
 * @param props.passenger - Passenger displayed in the row.
 * @param props.onContact - Callback fired when the contact button is pressed.
 * @returns The rendered passenger row.
 */
function PassengerRow({
  passenger,
  onContact,
  onEmail,
}: {
  passenger: Person;
  onContact: (passenger: Person) => void;
  onEmail: (passenger: Person) => void;
}) {
  const { t } = useI18n();
  const name = [passenger.first_name, passenger.last_name].filter(Boolean).join(" ") || t("driverTrips.passengerFallback");

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-4 sm:flex-row sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-sm font-medium text-[var(--theme-ink)]">
        {(passenger.first_name?.[0] ?? passenger.pseudo?.[0] ?? "?").toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--theme-ink)]">{name}</p>
        <p className="text-xs text-[var(--theme-muted)]">{passenger.pseudo ? `@${passenger.pseudo}` : `#${passenger.id}`}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onContact(passenger)}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-2 text-xs font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] hover:bg-[var(--theme-surface)]"
        >
          {t("driverTrips.contactPassenger")}
        </button>
        <button
          type="button"
          onClick={() => onEmail(passenger)}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[rgba(212,229,239,0.22)] px-4 py-2 text-xs font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)] hover:bg-[var(--theme-surface)]"
        >
          {t("driverTrips.emailPassenger")}
        </button>
      </div>
    </div>
  );
}

type Props = {
  trip: Trip;
  passengers: Person[];
  error: string | null;
  cancelling: boolean;
  onCancelTrip: () => void;
  onContactPassenger: (passenger: Person) => void;
  onContactPassengerEmail: (passenger: Person) => void;
};

/**
 * Present the driver-facing trip management screen.
 *
 * @param props - Component props for the driver trip-details view.
 * @param props.trip - Trip being managed by the driver.
 * @param props.passengers - Passenger list currently booked on the trip.
 * @param props.error - Optional error message shown in a toast.
 * @param props.cancelling - Whether a cancellation request is in progress.
 * @param props.onCancelTrip - Callback fired when the trip is cancelled.
 * @param props.onContactPassenger - Callback fired when the driver contacts a passenger.
 * @returns The rendered driver trip-details section.
 */
export function DriverTripDetailsSection({
  trip,
  passengers,
  error,
  cancelling,
  onCancelTrip,
  onContactPassenger,
  onContactPassengerEmail,
}: Props) {
  const { t } = useI18n();
  const from = trip.departure_address?.city?.name ?? "-";
  const to = trip.arrival_address?.city?.name ?? "-";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <FloatingToast tone="error" message={error} durationMs={6500} />
      <section className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-surface)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">{t("driverTrips.detailsDesk")}</p>
            <h1 className="mt-3 text-3xl font-medium leading-tight text-[var(--theme-ink)] sm:text-4xl">{from} - {to}</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("driverTrips.detailsBody")}</p>
          </div>
          <span className="inline-flex rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-4 py-2 text-sm font-medium text-[var(--theme-muted-strong)]">Trip #{trip.id}</span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon="🕐"
            title={t("driverTrips.tripTiming")}
            rows={[
              { label: t("trip.departure"), value: formatDateTimeRaw(trip.departure_time) },
              { label: t("trip.arrival"), value: formatDateTimeRaw(trip.arrival_time) },
              { label: t("trip.distance"), value: `${trip.distance_km} km` },
              { label: t("trip.seatsLeft"), value: trip.available_seats },
              { label: t("driverTrips.smoking"), value: trip.smoking_allowed ? t("driverTrips.allowed") : t("driverTrips.notAllowed") },
            ]}
          />

          <InfoCard
            icon="👤"
            title={t("trip.driver")}
            rows={[
              { label: t("profile.firstName"), value: trip.driver?.first_name },
              { label: t("profile.lastName"), value: trip.driver?.last_name },
              { label: t("profile.pseudo"), value: trip.driver?.pseudo },
              { label: t("profile.phone"), value: trip.driver?.phone },
            ]}
          />

          <InfoCard
            icon="📍"
            title={t("driverTrips.departurePoint")}
            rows={[
              { label: t("driverTrips.street"), value: [trip.departure_address?.street_number, trip.departure_address?.street].filter(Boolean).join(" ") },
              { label: t("driverTrips.postal"), value: trip.departure_address?.city?.postal_code },
              { label: t("driverTrips.city"), value: trip.departure_address?.city?.name },
            ]}
          />

          <InfoCard
            icon="🏁"
            title={t("driverTrips.arrivalPoint")}
            rows={[
              { label: t("driverTrips.street"), value: [trip.arrival_address?.street_number, trip.arrival_address?.street].filter(Boolean).join(" ") },
              { label: t("driverTrips.postal"), value: trip.arrival_address?.city?.postal_code },
              { label: t("driverTrips.city"), value: trip.arrival_address?.city?.name },
            ]}
          />
        </div>

        <div className="mt-8 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
               <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">{t("driverTrips.passengerList")}</p>
               <h2 className="mt-2 text-lg font-medium text-[var(--theme-ink)]">{t("driverTrips.travelingWithYou")}</h2>
            </div>
            <span className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--theme-muted-strong)]">{passengers.length}</span>
          </div>

          {passengers.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] text-xl">👤</div>
              <p className="mt-4 text-lg font-medium text-[var(--theme-ink)]">{t("driverTrips.noPassengers")}</p>
              <p className="mt-1 text-sm text-[var(--theme-muted)]">{t("driverTrips.noPassengersBody")}</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {passengers.map((passenger) => (
                <PassengerRow
                  key={passenger.id}
                  passenger={passenger}
                  onContact={onContactPassenger}
                  onEmail={onContactPassengerEmail}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onCancelTrip}
          disabled={cancelling}
          className="mt-8 w-full rounded-lg border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#444] disabled:opacity-40"
        >
          {cancelling ? t("driverTrips.cancelling") : t("driverTrips.cancelTrip")}
        </button>
      </section>
    </div>
  );
}
