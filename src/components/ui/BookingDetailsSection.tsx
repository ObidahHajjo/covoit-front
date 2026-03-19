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

export function BookingDetailsSection({
                                          trip,
                                          passengers,
                                          isTripEnded,
                                          cancelling,
                                          error,
                                          onCancel,
                                      }: Props) {
    const from = trip.departure_address?.city?.name ?? "—";
    const to = trip.arrival_address?.city?.name ?? "—";

    const departureStreetNumber = trip.departure_address?.street_number ?? " ";
    const departureStreetName = trip.departure_address?.street ?? " ";
    const departurePostalCode = trip.departure_address?.city?.postal_code ?? " ";
    const departureCityName = trip.departure_address?.city?.name ?? " ";
    const departurePoint = `${departureStreetNumber} ${departureStreetName}, ${departurePostalCode} ${departureCityName}`;

    const arrivalStreetNumber = trip.arrival_address?.street_number ?? " ";
    const arrivalStreetName = trip.arrival_address?.street ?? " ";
    const arrivalPostalCode = trip.arrival_address?.city?.postal_code ?? " ";
    const arrivalCityName = trip.arrival_address?.city?.name ?? " ";
    const arrivalPoint = `${arrivalStreetNumber} ${arrivalStreetName}, ${arrivalPostalCode} ${arrivalCityName}`;

    const departureDate = trip.departure_time
        ? new Date(trip.departure_time).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : null;

    return (
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Booking Details</h1>
                <p className="mt-1 text-sm text-slate-400">Trip information and passengers</p>
            </div>

            {error ? (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs">!</span>
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
            ) : null}

            {/* Trip card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-5">
                {/* Route */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow">
                        🗺
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Route</p>
                        <p className="font-semibold text-slate-800">
                            {from} → {to}
                        </p>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Departure */}
                {departureDate && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                            🕐
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Departure</p>
                            <p className="text-sm font-medium text-slate-800">{departureDate}</p>
                        </div>
                    </div>
                )}

                {/* Departure address */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        📍
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Departure address</p>
                        <p className="text-sm font-medium text-slate-800">{departurePoint}</p>
                    </div>
                </div>

                {/* Arrival address */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        🏁
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Arrival address</p>
                        <p className="text-sm font-medium text-slate-800">{arrivalPoint}</p>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Passengers */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        👥
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Passengers</p>
                        <p className="text-sm font-medium text-slate-800">
                            {passengers.length} {passengers.length === 1 ? "person" : "people"}
                        </p>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Status / Action */}
                {isTripEnded ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">✓</span>
                        <p className="text-sm font-medium text-emerald-700">This trip has already ended.</p>
                    </div>
                ) : (
                    <button
                        onClick={onCancel}
                        disabled={cancelling}
                        className="w-full rounded-2xl bg-rose-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-700 disabled:opacity-40"
                    >
                        {cancelling ? "Cancelling…" : "Cancel Reservation"}
                    </button>
                )}
            </div>
        </div>
    );
}