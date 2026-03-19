import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTrips } from "../../features/trips/tripApi";
import type { Trip } from "../../types/Trip";
import { useError } from "../../app/useError";

export function useTripResults() {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  const params = useMemo(() => ({
    startingcity: searchParams.get("startingcity") ?? undefined,
    arrivalcity: searchParams.get("arrivalcity") ?? undefined,
    tripdate: searchParams.get("tripdate") ?? undefined,
  }), [searchParams]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getTrips(params);
        setTrips(data);
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to load trips");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [params, showError]);

  return { trips, loading, params };
}
