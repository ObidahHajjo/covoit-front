import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactDriver } from "../../features/chat/chatApi";
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
      navigate("/bookings", {
        state: {
          toast: {
            tone: "success",
            message: "Reservation confirmed successfully.",
          },
        },
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function navigateToContactDriver() {
    if (!trip) return;

    try {
      setActionError(null);
      setSubmitting(true);

      const conversation = await contactDriver(trip.id, {
        subject: "Chat opened",
        message: "",
      });

      navigate(`/chat/${conversation.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to open driver chat");
    } finally {
      setSubmitting(false);
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
