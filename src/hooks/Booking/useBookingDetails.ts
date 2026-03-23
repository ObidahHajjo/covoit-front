import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactDriver } from "../../features/chat/chatApi.ts";
import { cancelReservation, getTripById, getTripPassengers } from "../../features/trips/tripApi.ts";
import type { Person } from "../../types/Person.ts";
import type { Trip } from "../../types/Trip.ts";
import { translate } from "../../i18n/config.ts";

/**
 * Loads a passenger booking and exposes actions related to that reservation.
 *
 * @returns Booking details state and handlers for cancellation and driver contact.
 */
export function useBookingDetails() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState<Trip | null>(null);
    const [passengers, setPassengers] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        /**
         * Fetches the booked trip and passenger manifest for the current route.
         *
         * @returns A promise that resolves once booking details have been loaded.
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
                setError(err instanceof Error ? err.message : translate("bookings.detailsLoadFailed"));
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

    /**
     * Cancels the current reservation and redirects back to the bookings list.
     *
     * @returns A promise that resolves once the cancellation flow completes.
     */
    async function handleCancel() {
        if (!tripId) return;
        try {
            setCancelling(true);
            setError(null);
            await cancelReservation(Number(tripId));
            navigate("/bookings", {
                state: {
                    toast: {
                        tone: "success",
                        message: translate("bookings.cancelledSuccess"),
                    },
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : translate("bookings.cancelFailed"));
        } finally {
            setCancelling(false);
        }
    }

    /**
     * Opens or creates the chat thread associated with the trip driver.
     *
     * @returns A promise that resolves once navigation to the chat screen is triggered.
     */
    async function navigateToContactDriver() {
        if (!trip) return;

        try {
            setError(null);
            const conversation = await contactDriver(trip.id, {
                subject: translate("trip.chatOpened"),
                message: "",
            });
            navigate(`/chat/${conversation.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : translate("trip.openDriverChatFailed"));
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
        navigateToContactDriver,
    };
}
