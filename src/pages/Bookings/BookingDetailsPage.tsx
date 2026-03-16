import {useEffect, useMemo, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelReservation, getTripById, getTripPassengers } from "../../features/trips/tripApi";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

export default function BookingDetailsPage() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [passengers, setPassengers] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                if (!tripId) throw new Error("Missing tripId");
                const [tripData, passengerData] = await Promise.all([
                    getTripById(Number(tripId)),
                    getTripPassengers(Number(tripId)),
                ]);
                setTrip(tripData);
                setPassengers(passengerData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load booking details");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [tripId]);

    const isTripEnded = useMemo(() => {
        if (!trip?.departure_time) {
            return false;
        }

        return new Date(trip.departure_time).getTime() <= Date.now();
    }, [trip?.departure_time]);

    async function handleCancel() {
        if (!tripId) return;

        try {
            await cancelReservation(Number(tripId));
            navigate("/bookings");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Cancel failed");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold">
                    {trip?.departure_address?.city?.name} → {trip?.arrival_address?.city?.name}
                </p>
                <p className="text-sm text-slate-900">Passengers: {passengers.length}</p>
                {isTripEnded ? (
                    <p className="mt-4 text-sm font-medium text-green-500">
                        This trip has already ended.
                    </p>
                ) : (
                    <button
                        onClick={handleCancel}
                        className="mt-4 rounded-xl bg-red-600 px-4 py-3 text-white"
                    >
                        Cancel Reservation
                    </button>
                )}
            </div>
        </section>
    );
}