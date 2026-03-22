import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactPassenger } from "../../features/chat/chatApi";
import { cancelTripAsDriver, getTripById, getTripPassengers } from "../../features/trips/tripApi";
import type { Person } from "../../types/Person";
import type { Trip } from "../../types/Trip";
import { translate } from "../../i18n/config";

/**
 * Loads a driver's trip details and exposes trip-management actions.
 *
 * @returns Driver trip details state and handlers for cancellation and passenger contact.
 */
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
                if (!tripId) throw new Error(translate("trip.missingTripId"));
                const [tripData, passengerData] = await Promise.all([
                    getTripById(Number(tripId)),
                    getTripPassengers(Number(tripId)),
                ]);
                setTrip(tripData);
                setPassengers(passengerData);
            } catch (err) {
                setError(err instanceof Error ? err.message : translate("trip.loadFailed"));
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, [tripId]);

    /**
     * Cancels the current trip and redirects back to the driver's trips list.
     *
     * @returns A promise that resolves once the cancellation flow completes.
     */
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
                        message: translate("driverTrips.cancelledSuccess"),
                    },
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : translate("driverTrips.cancelFailed"));
        } finally {
            setCancelling(false);
        }
    }

    /**
     * Opens or creates the chat thread for a passenger on this trip.
     *
     * @param passenger - Passenger whose conversation should be opened.
     * @returns A promise that resolves once navigation to the chat screen is triggered.
     */
    async function openPassengerChat(passenger: Person) {
        if (!trip) return;

        try {
            setError(null);
            const conversation = await contactPassenger(trip.id, passenger.id, {
                subject: translate("trip.chatOpened"),
                message: "",
            });
            navigate(`/chat/${conversation.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : translate("driverTrips.openPassengerChatFailed"));
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
