import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";
import PageLoadingState from "../common/PageLoadingState";
import FloatingToast from "../common/FloatingToast";
import { useI18n } from "../../i18n/I18nProvider";

type Props = {
    trip: Trip | null;
    loading: boolean;
    loadError: string | null;
    actionError: string | null;
    submitting: boolean;
    onReserve: () => void;
    onContactDriver: () => void;
};

/**
 * Display a labeled trip detail value.
 *
 * @param props - Component props for the trip detail card.
 * @param props.label - Label describing the value.
 * @param props.value - Text value shown inside the card.
 * @returns The rendered detail card.
 */
function DetailCard({ label, value }: { label: string; value: string }) {
	return (
	<div className="rounded-[12px] bg-[var(--theme-bg-soft)] p-4">
		<p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--theme-muted)]">{label}</p>
		<p className="mt-2 text-sm font-medium leading-6 text-[var(--theme-ink)]">{value}</p>
	</div>
	);
}

/**
 * Show the rider-facing details for a single trip.
 *
 * @param props - Component props for the trip-details screen.
 * @param props.trip - Trip to display, or `null` when unavailable.
 * @param props.loading - Whether trip data is still loading.
 * @param props.loadError - Error message for loading the trip details.
 * @param props.actionError - Error message for booking or contact actions.
 * @param props.submitting - Whether the booking action is currently in progress.
 * @param props.onReserve - Callback fired when the rider books the trip.
 * @param props.onContactDriver - Callback fired when the rider contacts the driver.
 * @returns The rendered trip-details view, loading state, or fallback message.
 */
export function TripDetailsSection({
    trip,
    loading,
    loadError,
    actionError,
    submitting,
    onReserve,
    onContactDriver,
}: Props) {
const { t } = useI18n();
if (loading) {
	return <PageLoadingState title={t("loading.tripDetails")} />;
}

	if (loadError || !trip) {
	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
		<div className="rounded-[16px] border border-dashed border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-6 py-14 text-center text-[var(--theme-ink)]">
			<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-surface)]">
				<span className="h-3 w-3 rounded-full bg-[var(--theme-muted)]" />
			</div>
			<p className="mt-4 text-2xl font-medium">{loadError ?? t("trip.notFound")}</p>
		</div>
		</div>
	);
}

    const from = trip.departure_address?.city?.name ?? t("common.unknown");
    const to = trip.arrival_address?.city?.name ?? t("common.unknown");
    const departurePoint = [trip.departure_address?.street_number, trip.departure_address?.street, trip.departure_address?.city?.postal_code, trip.departure_address?.city?.name]
        .filter(Boolean)
        .join(" ");
    const arrivalPoint = [trip.arrival_address?.street_number, trip.arrival_address?.street, trip.arrival_address?.city?.postal_code, trip.arrival_address?.city?.name]
        .filter(Boolean)
        .join(" ");
    const driverName = [trip.driver?.first_name, trip.driver?.last_name].filter(Boolean).join(" ") || trip.driver?.pseudo || t("chat.driver");

return (
	<div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
		<FloatingToast tone="error" message={actionError} durationMs={6500} />
		<section className="overflow-hidden rounded-[24px] border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 text-[var(--theme-ink)] sm:px-7 sm:py-8">
		<p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">{t("trip.tripDetails")}</p>
		<div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div>
			<h1 className="text-4xl font-medium leading-[1.1] text-[var(--theme-ink)] sm:text-5xl">{from} - {to}</h1>
			<p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("trip.detailsBody")}</p>
			</div>
			<span className="inline-flex rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-2 text-sm font-medium text-[var(--theme-ink)]">Trip #{trip.id}</span>
		</div>

		<div className="mt-8 grid gap-4 md:grid-cols-2">
			<DetailCard label={t("trip.departure")} value={formatDateTimeRaw(trip.departure_time)} />
			<DetailCard label={t("trip.arrival")} value={trip.arrival_time ? formatDateTimeRaw(trip.arrival_time) : t("trip.arrivalPending")} />
			<DetailCard label={t("trip.departureAddress")} value={departurePoint || t("common.addressUnavailable")} />
			<DetailCard label={t("trip.arrivalAddress")} value={arrivalPoint || t("common.addressUnavailable")} />
			<DetailCard label={t("trip.distance")} value={`${trip.distance_km} km`} />
			<DetailCard label={t("trip.seatsLeft")} value={t("trip.availableSeats", { count: trip.available_seats })} />
			<DetailCard label={t("trip.rideStyle")} value={trip.smoking_allowed ? t("trip.smokingAllowed") : t("trip.nonSmoking")} />
			<DetailCard label={t("trip.driver")} value={driverName} />
		</div>

		<div className="mt-8 grid gap-3 sm:grid-cols-2">
			<button
			onClick={onReserve}
			disabled={submitting}
			className="rounded-full bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:opacity-50"
			>
			{submitting ? t("trip.booking") : t("trip.confirmBooking")}
			</button>

			<button
			onClick={onContactDriver}
			className="rounded-full border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm font-medium text-[var(--theme-ink)] transition hover:border-[var(--theme-line-strong)]"
			>
			{t("trip.contactDriver")}
			</button>
		</div>
		</section>
	</div>
	);
}
