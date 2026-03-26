import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTripById, reserveTrip } from "../../features/trips/tripApi.ts";
import type { Trip } from "../../types/Trip.ts";
import { translate } from "../../i18n/config.ts";

/**
 * Loads a public trip and exposes reservation and contact actions.
 *
 * @returns Trip details state and handlers for reservation and driver contact.
 */
export function useTripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    /**
     * Fetches the trip identified by the current route parameter.
     *
     * @returns A promise that resolves once trip details have been loaded.
     */
    async function load() {
      try {
        setLoading(true);
        setLoadError(null);

        if (!tripId) {
          throw new Error(translate("trip.missingTripId"));
        }

        const data = await getTripById(Number(tripId));
        setTrip(data);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : translate("trip.loadFailed"));
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [tripId]);

  /**
   * Reserves the current trip and redirects to the bookings page.
   *
   * @returns A promise that resolves once the reservation flow completes.
   */
  async function handleReserve() {
    if (!tripId) return;

    try {
      setSubmitting(true);
      setActionError(null);

      await reserveTrip(Number(tripId));
      navigate("/bookings", {
        state: {
          toast: {
            tone: "success",
            message: translate("trip.reservationConfirmed"),
          },
        },
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : translate("trip.bookingFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Opens the dedicated contact form for the trip driver.
   */
  function navigateToContactDriver() {
    if (!trip) return;

    setActionError(null);
    navigate(`/trips/${trip.id}/contact-driver`);
  }

  /**
   * Navigates to the email contact form for the trip driver.
   */
  function navigateToContactDriverEmail() {
    if (!trip) return;
    navigate(`/trips/${trip.id}/contact-driver-email`);
  }

  return {
    trip,
    loading,
    loadError,
    actionError,
    submitting,
    handleReserve,
    navigateToContactDriver,
    navigateToContactDriverEmail,
  };
}
