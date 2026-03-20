import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";

type Props = {
    trip: Trip | null;
    loading: boolean;
    loadError: string | null;
    actionError: string | null;
    submitting: boolean;
    onReserve: () => void;
    onContactDriver: () => void;
};

function DetailCard({ label, value }: { label: string; value: string }) {
	return (
	<div className="rounded-[12px] bg-[#fafafa] p-4">
		<p className="text-xs font-medium uppercase tracking-[0.15em] text-[#888]">{label}</p>
		<p className="mt-2 text-sm font-medium leading-6 text-[#222]">{value}</p>
	</div>
	);
}

export function TripDetailsSection({
    trip,
    loading,
    loadError,
    actionError,
    submitting,
    onReserve,
    onContactDriver,
}: Props) {
if (loading) {
	return (
	<div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-6 sm:px-6 lg:px-0">
		<div className="space-y-3 text-center">
		<div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eee] border-t-[#222]" />
		<p className="text-sm text-[#888]">Loading trip details...</p>
		</div>
	</div>
	);
}

	if (loadError || !trip) {
	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
		<div className="rounded-[16px] border border-dashed border-[#eee] bg-[#fafafa] px-6 py-14 text-center text-[#222]">
			<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
				<span className="h-3 w-3 rounded-full bg-[#888]" />
			</div>
			<p className="mt-4 text-2xl font-medium">{loadError ?? "Trip not found."}</p>
		</div>
		</div>
	);
}

    const from = trip.departure_address?.city?.name ?? "Unknown";
    const to = trip.arrival_address?.city?.name ?? "Unknown";
    const departurePoint = [trip.departure_address?.street_number, trip.departure_address?.street, trip.departure_address?.city?.postal_code, trip.departure_address?.city?.name]
        .filter(Boolean)
        .join(" ");
    const arrivalPoint = [trip.arrival_address?.street_number, trip.arrival_address?.street, trip.arrival_address?.city?.postal_code, trip.arrival_address?.city?.name]
        .filter(Boolean)
        .join(" ");
    const driverName = [trip.driver?.first_name, trip.driver?.last_name].filter(Boolean).join(" ") || trip.driver?.pseudo || "Driver";

return (
	<div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
		<section className="overflow-hidden rounded-[24px] border border-[#eee] bg-[#fafafa] px-5 py-6 text-[#222] sm:px-7 sm:py-8">
		<p className="text-xs font-medium uppercase tracking-[0.2em] text-[#888]">Trip details</p>
		<div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div>
			<h1 className="text-4xl font-medium leading-[1.1] text-[#222] sm:text-5xl">{from} - {to}</h1>
			<p className="mt-4 text-sm leading-6 text-[#666] sm:text-base">A warm overview of timing, route notes, and booking actions before you commit.</p>
			</div>
			<span className="inline-flex rounded-full border border-[#eee] bg-white px-4 py-2 text-sm font-medium text-[#222]">Trip #{trip.id}</span>
		</div>

		{actionError ? (
			<div className="mt-6 rounded-[12px] border border-[#eee] bg-white px-4 py-3 text-sm font-medium text-[#222]">
			{actionError}
			</div>
		) : null}

		<div className="mt-8 grid gap-4 md:grid-cols-2">
			<DetailCard label="Departure" value={formatDateTimeRaw(trip.departure_time)} />
			<DetailCard label="Arrival" value={trip.arrival_time ? formatDateTimeRaw(trip.arrival_time) : "Arrival time pending"} />
			<DetailCard label="Departure address" value={departurePoint || "Address unavailable"} />
			<DetailCard label="Arrival address" value={arrivalPoint || "Address unavailable"} />
			<DetailCard label="Distance" value={`${trip.distance_km} km`} />
			<DetailCard label="Seats left" value={`${trip.available_seats} available`} />
			<DetailCard label="Ride style" value={trip.smoking_allowed ? "Smoking allowed" : "Non-smoking ride"} />
			<DetailCard label="Driver" value={driverName} />
		</div>

		<div className="mt-8 grid gap-3 sm:grid-cols-2">
			<button
			onClick={onReserve}
			disabled={submitting}
			className="rounded-full bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-50"
			>
			{submitting ? "Booking..." : "Confirm booking"}
			</button>

			<button
			onClick={onContactDriver}
			className="rounded-full border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#222] transition hover:border-[#ccc]"
			>
			Contact driver
			</button>
		</div>
		</section>
	</div>
	);
}
