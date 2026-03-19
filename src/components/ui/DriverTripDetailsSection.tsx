import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

// ── Reusable sub-components ───────────────────────────────────────────────────

function InfoCard({ icon, title, rows }: {
    icon: string;
    title: string;
    rows: { label: string; value: string | number | undefined | null }[];
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-3 sm:p-5">
            <div className="flex items-center gap-2">
                <span className="text-base">{icon}</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h3>
            </div>
            <div className="space-y-2">
                {rows.map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                        <span className="text-xs text-slate-400 shrink-0">{label}</span>
                        <span className="text-xs font-semibold text-slate-700 text-right">
                            {value ?? "—"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PassengerRow({ passenger, contactPath }: { passenger: Person; contactPath: string }) {
    const name = [passenger.first_name, passenger.last_name].filter(Boolean).join(" ") || "—";

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow">
                {(passenger.first_name?.[0] ?? passenger.pseudo?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                <p className="text-xs text-slate-400">{passenger.pseudo ? `@${passenger.pseudo}` : `#${passenger.id}`}</p>
            </div>
            <Link
                to={contactPath}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
            >
                Contact
            </Link>
        </div>
    );
}

// ── Main section ──────────────────────────────────────────────────────────────

type Props = {
    trip: Trip;
    passengers: Person[];
    error: string | null;
    cancelling: boolean;
    onCancelTrip: () => void;
    getContactPassengerPath: (passengerId: number) => string;
};

export function DriverTripDetailsSection({
                                             trip,
                                             passengers,
                                             error,
                                             cancelling,
                                             onCancelTrip,
                                             getContactPassengerPath,
                                         }: Props) {
    const from = trip.departure_address?.city?.name ?? "—";
    const to = trip.arrival_address?.city?.name ?? "—";

    return (
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Trip</h1>
                    <p className="mt-1 text-sm text-slate-400">Trip #{trip.id}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    #{trip.id}
                </span>
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs">!</span>
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
            )}

            {/* Route banner */}
            <div className="flex items-center gap-3 rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow">
                    🗺
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Route</p>
                    <p className="font-bold text-slate-800">{from} → {to}</p>
                </div>
            </div>

            {/* Info cards grid */}
            <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard
                    icon="🕐"
                    title="Trip info"
                    rows={[
                        { label: "Departure", value: formatDateTimeRaw(trip.departure_time) },
                        { label: "Arrival", value: formatDateTimeRaw(trip.arrival_time) },
                        { label: "Distance", value: trip.distance_km ? `${trip.distance_km} km` : null },
                        { label: "Seats available", value: trip.available_seats },
                        { label: "Smoking", value: trip.smoking_allowed ? "Allowed" : "Not allowed" },
                    ]}
                />

                <InfoCard
                    icon="👤"
                    title="Driver"
                    rows={[
                        { label: "First name", value: trip.driver?.first_name },
                        { label: "Last name", value: trip.driver?.last_name },
                        { label: "Pseudo", value: trip.driver?.pseudo },
                        { label: "Phone", value: trip.driver?.phone },
                    ]}
                />

                <InfoCard
                    icon="📍"
                    title="Departure address"
                    rows={[
                        {
                            label: "Street",
                            value: [trip.departure_address?.street_number, trip.departure_address?.street]
                                .filter(Boolean).join(" ") || null,
                        },
                        { label: "Postal code", value: trip.departure_address?.city?.postal_code },
                        { label: "City", value: trip.departure_address?.city?.name },
                    ]}
                />

                <InfoCard
                    icon="🏁"
                    title="Arrival address"
                    rows={[
                        {
                            label: "Street",
                            value: [trip.arrival_address?.street_number, trip.arrival_address?.street]
                                .filter(Boolean).join(" ") || null,
                        },
                        { label: "Postal code", value: trip.arrival_address?.city?.postal_code },
                        { label: "City", value: trip.arrival_address?.city?.name },
                    ]}
                />
            </div>

            {/* Passengers */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        👥 Passengers
                    </h3>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                        {passengers.length}
                    </span>
                </div>

                {passengers.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center">
                        <span className="text-3xl">👤</span>
                        <p className="text-sm text-slate-400">No passengers yet.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {passengers.map((passenger) => (
                            <PassengerRow
                                key={passenger.id}
                                passenger={passenger}
                                contactPath={getContactPassengerPath(passenger.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel */}
            <button
                onClick={onCancelTrip}
                disabled={cancelling}
                className="w-full rounded-2xl bg-rose-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-700 disabled:opacity-40"
            >
                {cancelling ? "Cancelling…" : "Cancel Trip"}
            </button>
        </div>
    );
}