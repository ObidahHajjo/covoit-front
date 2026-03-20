import { Link } from "react-router-dom";
import type { Trip } from "../../types/Trip";

type Props = {
    bookings: Trip[];
    now?: number;
};

function TripCard({ trip, now }: { trip: Trip; now: number }) {
    const from = trip.departure_address?.city?.name ?? "-";
    const to = trip.arrival_address?.city?.name ?? "-";
    const date = trip.departure_time
        ? new Date(trip.departure_time).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : null;
    const isPast = trip.departure_time ? new Date(trip.departure_time).getTime() <= now : false;

    return (
        <Link
            to={`/bookings/${trip.id}`}
            className="group flex items-center gap-4 rounded-[28px] border border-white/70 bg-white/75 p-4 text-[#18352d] shadow-[0_22px_60px_-34px_rgba(24,53,45,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#f3b8ab] hover:bg-white/90 sm:p-5"
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#f26f5a] to-[#de8f62] text-lg text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)]">
                🚗
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-xl leading-tight text-[#18352d]">{from} - {to}</p>
                {date ? <p className="mt-2 text-sm text-[#5d746b]">{date}</p> : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPast ? "bg-[#f7f1ea] text-[#5d746b]" : "bg-[#fce3db] text-[#8c4d3f]"}`}>
                    {isPast ? "Completed" : "Booked"}
                </span>
            </div>
        </Link>
    );
}

const CURRENT_TIME = Date.now();

export function MyBookingsSection({ bookings, now = CURRENT_TIME }: Props) {
    return (
        <section className="rounded-[32px] border border-white/65 bg-white/55 p-5 text-[#18352d] shadow-[0_28px_80px_-44px_rgba(24,53,45,0.42)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Booked routes</p>
                    <h2 className="mt-2 font-serif text-3xl leading-tight text-[#18352d]">Your ride plans</h2>
                </div>
                <p className="text-sm text-[#5d746b]">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} saved</p>
            </div>

            {bookings.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-[#d8cfc2] bg-[#fffaf6]/90 py-16 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ede2] text-3xl">🗓</span>
                    <p className="font-serif text-2xl text-[#18352d]">No bookings yet.</p>
                    <p className="text-sm text-[#5d746b]">Your upcoming trips will appear here as soon as you reserve a seat.</p>
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
