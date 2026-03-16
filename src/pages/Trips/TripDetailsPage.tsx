import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTripById, reserveTrip } from "../../features/trips/tripApi";
import type { Trip } from "../../types/Trip";

export default function TripDetailsPage() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setLoadError(null);

                if (!tripId) {
                    throw new Error("Missing tripId");
                }

                const data = await getTripById(Number(tripId));
                setTrip(data);
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : "Failed to load trip");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [tripId]);

    async function handleReserve() {
        if (!tripId) return;

        try {
            setSubmitting(true);
            setActionError(null);

            await reserveTrip(Number(tripId));
            navigate("/bookings");
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Booking failed");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (loadError) return <p>{loadError}</p>;
    if (!trip) return <p>Trip not found.</p>;

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold">Trip Details</h1>

            {actionError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {actionError}
                </div>
            )}

            <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold">
                    {trip.departure_address?.city?.name} → {trip.arrival_address?.city?.name}
                </p>
                <p className="text-sm text-slate-500">{trip.departure_time}</p>
                <p className="text-sm text-slate-500">Distance: {trip.distance_km} km</p>
                <p className="text-sm text-slate-500">Seats left: {trip.available_seats}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                        onClick={handleReserve}
                        disabled={submitting}
                        className="rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-50"
                    >
                        {submitting ? "Booking..." : "Confirm Booking"}
                    </button>

                    <button
                        onClick={() => navigate(`/trips/${trip.id}/contact-driver`)}
                        className="rounded-xl border px-4 py-3"
                    >
                        Send Email
                    </button>
                </div>
            </div>
        </section>
    );
}