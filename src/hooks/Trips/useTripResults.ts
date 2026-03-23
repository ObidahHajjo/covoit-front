import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTrips } from "../../features/trips/tripApi.ts";
import type { Trip } from "../../types/Trip.ts";
import { useError } from "../../context/ErrorContext.ts";

/**
 * Loads trip search results from the current URL query parameters.
 *
 * @returns Search parameters plus the resulting trip collection and loading state.
 */
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
    /**
     * Fetches trip search results for the current query-string filters.
     *
     * @returns A promise that resolves once search results have been loaded.
     */
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
