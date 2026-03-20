import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";

type Props = {
    trips: Trip[];
    loading: boolean;
};

function TripCard({ trip }: { trip: Trip }) {
	const from = trip.departure_address?.city?.name ?? "Unknown";
	const to = trip.arrival_address?.city?.name ?? "Unknown";

	return (
	<Link
		to={`/trips/${trip.id}`}
		className="group block rounded-[16px] border border-[#eee] bg-white p-5 text-[#222] transition hover:border-[#ccc]"
	>
		<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<p className="text-xs font-medium uppercase tracking-[0.15em] text-[#888]">Route preview</p>
			<h2 className="mt-2 text-2xl font-medium leading-tight text-[#222]">{from} - {to}</h2>
			<p className="mt-2 text-sm text-[#666]">{formatDateTimeRaw(trip.departure_time)}</p>
		</div>
		<span className="inline-flex items-center gap-2 rounded-full bg-[#fafafa] px-3 py-1 text-xs font-medium text-[#222]">
			<span className="h-2 w-2 rounded-full bg-[#888]" />
			{trip.available_seats} seat{trip.available_seats !== 1 ? "s" : ""}
		</span>
		</div>

		<div className="mt-4 grid gap-3 text-sm text-[#666] sm:grid-cols-3">
		<div className="rounded-[12px] bg-[#fafafa] px-4 py-3">Trip #{trip.id}</div>
		<div className="rounded-[12px] bg-[#fafafa] px-4 py-3">{trip.distance_km} km</div>
		<div className="rounded-[12px] bg-[#fafafa] px-4 py-3">Friendly pickup details inside</div>
		</div>
	</Link>
	);
}

export function TripResultsSection({ trips, loading }: Props) {
	return (
	<div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
		<section className="overflow-hidden rounded-[24px] border border-[#eee] bg-[#fafafa] px-5 py-6 text-[#222] sm:px-7 sm:py-8">
		<div className="max-w-3xl">
			<p className="text-xs font-medium uppercase tracking-[0.2em] text-[#888]">Trip search</p>
			<h1 className="mt-3 text-4xl font-medium leading-[1.1] text-[#222] sm:text-5xl">Choose the ride that feels right.</h1>
			<p className="mt-4 text-sm leading-6 text-[#666] sm:text-base">
			Compare timing, seat count, and route details in one warm, easy-to-scan list.
			</p>
		</div>

		{loading ? (
			<div className="mt-8 flex min-h-[30vh] items-center justify-center rounded-[16px] border border-[#eee] bg-white">
			<div className="space-y-3 text-center">
				<div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eee] border-t-[#222]" />
				<p className="text-sm text-[#888]">Looking for matching rides...</p>
			</div>
			</div>
		) : trips.length === 0 ? (
			<div className="mt-8 rounded-[16px] border border-dashed border-[#eee] bg-white px-6 py-12 text-center">
			<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fafafa]">
				<span className="h-3 w-3 rounded-full bg-[#888]" />
			</div>
			<p className="mt-4 text-2xl font-medium text-[#222]">No rides match this search yet.</p>
			<p className="mt-2 text-sm text-[#888]">Try a different city pair or broaden the day to see more options.</p>
			</div>
		) : (
			<div className="mt-8 space-y-4">
			{trips.map((trip) => (
				<TripCard key={trip.id} trip={trip} />
			))}
			</div>
		)}
		</section>
	</div>
	);
}
