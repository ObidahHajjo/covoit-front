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
            className="group block rounded-[28px] border border-white/70 bg-white/75 p-5 text-[#18352d] shadow-[0_22px_60px_-34px_rgba(24,53,45,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#f3b8ab] hover:bg-white/90"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Route preview</p>
                    <h2 className="mt-2 font-serif text-2xl leading-tight text-[#18352d]">{from} - {to}</h2>
                    <p className="mt-2 text-sm text-[#5d746b]">{formatDateTimeRaw(trip.departure_time)}</p>
                </div>
                <span className="inline-flex rounded-full bg-[#f7ede2] px-3 py-1 text-xs font-semibold text-[#8c4d3f]">
                    {trip.available_seats} seat{trip.available_seats !== 1 ? "s" : ""}
                </span>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-[#4c655b] sm:grid-cols-3">
                <div className="rounded-[20px] bg-[#fffaf6] px-4 py-3">Trip #{trip.id}</div>
                <div className="rounded-[20px] bg-[#fffaf6] px-4 py-3">{trip.distance_km} km</div>
                <div className="rounded-[20px] bg-[#fffaf6] px-4 py-3">Friendly pickup details inside</div>
            </div>
        </Link>
    );
}

export function TripResultsSection({ trips, loading }: Props) {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
            <section className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 text-[#18352d] shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Trip search</p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">Choose the ride that feels right.</h1>
                    <p className="mt-4 text-sm leading-6 text-[#4c655b] sm:text-base">
                        Compare timing, seat count, and route details in one warm, easy-to-scan list.
                    </p>
                </div>

                {loading ? (
                    <div className="mt-8 flex min-h-[30vh] items-center justify-center rounded-[32px] border border-white/70 bg-white/55 backdrop-blur-xl">
                        <div className="space-y-3 text-center">
                            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#f26f5a]" />
                            <p className="text-sm text-[#5d746b]">Looking for matching rides...</p>
                        </div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="mt-8 rounded-[32px] border border-dashed border-[#d8cfc2] bg-white/60 px-6 py-12 text-center backdrop-blur-xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ede2] text-3xl">🧭</div>
                        <p className="mt-4 font-serif text-2xl text-[#18352d]">No rides match this search yet.</p>
                        <p className="mt-2 text-sm text-[#5d746b]">Try a different city pair or broaden the day to see more options.</p>
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
