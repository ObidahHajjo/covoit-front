import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

type Props = {
    trip: Trip;
    passengers: Person[];
    isTripEnded: boolean;
    cancelling: boolean;
    error: string | null;
    onCancel: () => void;
};

function DetailCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[24px] bg-[#fffaf6] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b06f60]">{label}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-[#335246]">{value}</p>
        </div>
    );
}

export function BookingDetailsSection({
    trip,
    passengers,
    isTripEnded,
    cancelling,
    error,
    onCancel,
}: Props) {
    const from = trip.departure_address?.city?.name ?? "-";
    const to = trip.arrival_address?.city?.name ?? "-";
    const departurePoint = [trip.departure_address?.street_number, trip.departure_address?.street, trip.departure_address?.city?.postal_code, trip.departure_address?.city?.name]
        .filter(Boolean)
        .join(" ");
    const arrivalPoint = [trip.arrival_address?.street_number, trip.arrival_address?.street, trip.arrival_address?.city?.postal_code, trip.arrival_address?.city?.name]
        .filter(Boolean)
        .join(" ");
    const departureDate = trip.departure_time
        ? new Date(trip.departure_time).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "Date unavailable";

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
            <section className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 text-[#18352d] shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Booking details</p>
                <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">{from} - {to}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4c655b] sm:text-base">Keep departure notes, passenger count, and cancellation actions together in one calm view.</p>

                {error ? (
                    <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {error}
                    </div>
                ) : null}

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <DetailCard label="Departure" value={departureDate} />
                    <DetailCard label="Passengers" value={`${passengers.length} ${passengers.length === 1 ? "person" : "people"}`} />
                    <DetailCard label="Departure address" value={departurePoint || "Address unavailable"} />
                    <DetailCard label="Arrival address" value={arrivalPoint || "Address unavailable"} />
                    <DetailCard label="Distance" value={`${trip.distance_km} km`} />
                    <DetailCard label="Ride style" value={trip.smoking_allowed ? "Smoking allowed" : "Non-smoking ride"} />
                </div>

                <div className="mt-8 rounded-[32px] border border-white/70 bg-white/60 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Reservation status</p>
                            <h2 className="mt-2 font-serif text-2xl text-[#18352d]">{isTripEnded ? "This ride has already wrapped up." : "Your seat is currently reserved."}</h2>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isTripEnded ? "bg-emerald-50 text-emerald-700" : "bg-[#fce3db] text-[#8c4d3f]"}`}>
                            {isTripEnded ? "Ended" : "Active"}
                        </span>
                    </div>

                    {!isTripEnded ? (
                        <button
                            onClick={onCancel}
                            disabled={cancelling}
                            className="mt-5 w-full rounded-full bg-[#f26f5a] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b] disabled:opacity-40"
                        >
                            {cancelling ? "Cancelling..." : "Cancel reservation"}
                        </button>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
