import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelTripAsDriver, getTripById, getTripPassengers } from "../../features/trips/tripApi.ts";
import type { Person } from "../../types/Person.ts";
import type { Trip } from "../../types/Trip.ts";
import { translate } from "../../i18n/config.ts";

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
        /**
         * Fetches the managed trip and its passenger list for the current route.
         *
         * @returns A promise that resolves once driver trip details have been loaded.
         */
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
     * Opens the dedicated contact form for a passenger on this trip.
     *
     * @param passenger - Passenger whose conversation form should be opened.
     */
    function openPassengerChat(passenger: Person) {
        if (!trip) return;

        setError(null);
        navigate(`/my-trips/${trip.id}/contact-passenger/${passenger.id}`);
    }

    function openPassengerEmail(passenger: Person) {
        if (!trip) return;

        navigate(`/my-trips/${trip.id}/contact-passenger/${passenger.id}/email`);
    }

    return {
        trip,
        passengers,
        loading,
        error,
        cancelling,
        handleCancelTrip,
        openPassengerChat,
        openPassengerEmail,
    };
}
