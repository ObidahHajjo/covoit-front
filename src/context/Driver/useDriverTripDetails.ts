import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactPassenger } from "../../features/chat/chatApi";
import { cancelTripAsDriver, getTripById, getTripPassengers } from "../../features/trips/tripApi";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";

export function useDriverTripDetails() {
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
                setError(err instanceof Error ? err.message : "Failed to load trip details");
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, [tripId]);

    async function handleCancelTrip() {
        if (!tripId) return;
        try {
            setCancelling(true);
            setError(null);
            await cancelTripAsDriver(Number(tripId));
            navigate("/my-trips", {
                state: {
                    toast: {
                        tone: "success",
                        message: "Trip cancelled successfully.",
                    },
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to cancel trip");
        } finally {
            setCancelling(false);
        }
    }

    async function openPassengerChat(passenger: Person) {
        if (!trip) return;

        try {
            setError(null);
            const conversation = await contactPassenger(trip.id, passenger.id, {
                subject: "Chat opened",
                message: "",
            });
            navigate(`/chat/${conversation.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to open passenger chat");
        }
    }

    return {
        trip,
        passengers,
        loading,
        error,
        cancelling,
        handleCancelTrip,
        openPassengerChat,
    };
}
