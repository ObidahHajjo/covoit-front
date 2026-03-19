import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelReservation, getTripById, getTripPassengers } from "../../features/trips/tripApi";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

export function useBookingDetails() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState<Trip | null>(null);
    const [passengers, setPassengers] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

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
        if (!trip?.departure_time) return false;
        return new Date(trip.departure_time).getTime() <= Date.now();
    }, [trip?.departure_time]);

    async function handleCancel() {
        if (!tripId) return;
        try {
            setCancelling(true);
            setError(null);
            await cancelReservation(Number(tripId));
            navigate("/bookings");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Cancel failed");
        } finally {
            setCancelling(false);
        }
    }

    return {
        trip,
        passengers,
        loading,
        error,
        cancelling,
        isTripEnded,
        handleCancel,
    };
}