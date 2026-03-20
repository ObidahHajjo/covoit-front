import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

function InfoCard({ icon, title, rows }: {
    icon: string;
    title: string;
    rows: { label: string; value: string | number | undefined | null }[];
}) {
    return (
        <div className="rounded-[28px] border border-white/70 bg-white/60 p-5 text-[#18352d] shadow-[0_22px_60px_-34px_rgba(24,53,45,0.35)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7ede2] text-base">{icon}</span>
                <h3 className="font-serif text-xl text-[#18352d]">{title}</h3>
            </div>
            <div className="mt-4 space-y-3">
                {rows.map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4 rounded-[18px] bg-[#fffaf6] px-3 py-2.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b06f60]">{label}</span>
                        <span className="text-right text-sm font-medium text-[#335246]">{value ?? "-"}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PassengerRow({ passenger, contactPath }: { passenger: Person; contactPath: string }) {
    const name = [passenger.first_name, passenger.last_name].filter(Boolean).join(" ") || "Passenger";

    return (
        <div className="flex flex-col gap-3 rounded-[24px] border border-white/70 bg-white/75 px-4 py-4 text-[#18352d] shadow-[0_18px_46px_-32px_rgba(24,53,45,0.35)] sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#f26f5a] to-[#de8f62] text-sm font-bold text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)]">
                {(passenger.first_name?.[0] ?? passenger.pseudo?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#18352d]">{name}</p>
                <p className="text-xs text-[#5d746b]">{passenger.pseudo ? `@${passenger.pseudo}` : `#${passenger.id}`}</p>
            </div>
            <Link
                to={contactPath}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#d8cfc2] bg-[#fff9f4] px-4 py-2 text-xs font-semibold text-[#335246] transition hover:border-[#f3b8ab] hover:text-[#8c4d3f]"
            >
                Contact passenger
            </Link>
        </div>
    );
}

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
    const from = trip.departure_address?.city?.name ?? "-";
    const to = trip.arrival_address?.city?.name ?? "-";

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
            <section className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 text-[#18352d] shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Driver trip desk</p>
                        <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">{from} - {to}</h1>
                        <p className="mt-4 text-sm leading-6 text-[#4c655b] sm:text-base">Manage route details, passenger outreach, and cancellation from one composed view.</p>
                    </div>
                    <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#335246]">Trip #{trip.id}</span>
                </div>

                {error ? (
                    <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {error}
                    </div>
                ) : null}

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <InfoCard
                        icon="🕐"
                        title="Trip timing"
                        rows={[
                            { label: "Departure", value: formatDateTimeRaw(trip.departure_time) },
                            { label: "Arrival", value: formatDateTimeRaw(trip.arrival_time) },
                            { label: "Distance", value: `${trip.distance_km} km` },
                            { label: "Seats left", value: trip.available_seats },
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
                        title="Departure point"
                        rows={[
                            { label: "Street", value: [trip.departure_address?.street_number, trip.departure_address?.street].filter(Boolean).join(" ") },
                            { label: "Postal", value: trip.departure_address?.city?.postal_code },
                            { label: "City", value: trip.departure_address?.city?.name },
                        ]}
                    />

                    <InfoCard
                        icon="🏁"
                        title="Arrival point"
                        rows={[
                            { label: "Street", value: [trip.arrival_address?.street_number, trip.arrival_address?.street].filter(Boolean).join(" ") },
                            { label: "Postal", value: trip.arrival_address?.city?.postal_code },
                            { label: "City", value: trip.arrival_address?.city?.name },
                        ]}
                    />
                </div>

                <div className="mt-8 rounded-[32px] border border-white/70 bg-white/60 p-5 text-[#18352d] shadow-[0_28px_80px_-44px_rgba(24,53,45,0.38)] backdrop-blur-xl sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Passenger list</p>
                            <h2 className="mt-2 font-serif text-2xl text-[#18352d]">Traveling with you</h2>
                        </div>
                        <span className="rounded-full bg-[#fff9f4] px-3 py-1 text-xs font-semibold text-[#335246]">{passengers.length}</span>
                    </div>

                    {passengers.length === 0 ? (
                        <div className="mt-5 rounded-[28px] border border-dashed border-[#d8cfc2] bg-[#fffaf6]/90 px-6 py-10 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7ede2] text-2xl">👤</div>
                            <p className="mt-4 font-serif text-xl text-[#18352d]">No passengers yet.</p>
                            <p className="mt-1 text-sm text-[#5d746b]">New reservations will appear here as they come in.</p>
                        </div>
                    ) : (
                        <div className="mt-5 space-y-3">
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

                <button
                    onClick={onCancelTrip}
                    disabled={cancelling}
                    className="mt-8 w-full rounded-full bg-[#f26f5a] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b] disabled:opacity-40"
                >
                    {cancelling ? "Cancelling..." : "Cancel this trip"}
                </button>
            </section>
        </div>
    );
}
