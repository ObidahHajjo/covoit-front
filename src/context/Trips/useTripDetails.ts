import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTripById, reserveTrip } from "../../features/trips/tripApi";
import type { Trip } from "../../types/Trip";

export function useTripDetails() {
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

  function navigateToContactDriver() {
    if (trip) {
      navigate(`/trips/${trip.id}/contact-driver`);
    }
  }

  return {
    trip,
    loading,
    loadError,
    actionError,
    submitting,
    handleReserve,
    navigateToContactDriver,
  };
}
