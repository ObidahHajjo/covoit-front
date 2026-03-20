import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";
import { PageIntro, SurfaceCard } from "../common/SerenePrimitives";

type Props = {
  trips: Trip[];
  loading: boolean;
};

function TripCard({ trip }: { trip: Trip }) {
  const from = trip.departure_address?.city?.name ?? "Unknown";
  const to = trip.arrival_address?.city?.name ?? "Unknown";

  return (
    <Link to={`/trips/${trip.id}`} className="serene-card serene-card-hover group block p-5 text-[var(--theme-ink)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="serene-kicker">Route preview</p>
          <h2 className="mt-2 font-heading text-3xl font-bold leading-tight text-[var(--theme-ink)]">
            {from} - {to}
          </h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-strong)]">{formatDateTimeRaw(trip.departure_time)}</p>
        </div>
        <span className="serene-chip">
          <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)]" />
          {trip.available_seats} seat{trip.available_seats !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-[var(--theme-muted-strong)] sm:grid-cols-3">
        <div className="serene-soft px-4 py-3">Trip #{trip.id}</div>
        <div className="serene-soft px-4 py-3">{trip.distance_km} km</div>
        <div className="serene-soft px-4 py-3">Friendly pickup details inside</div>
      </div>
    </Link>
  );
}

export function TripResultsSection({ trips, loading }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <PageIntro
        eyebrow="Trip search"
        title="Choose the ride that feels right."
        description="Compare timing, seat count, and route details in one warm, easy-to-scan list."
      >
        {loading ? (
          <SurfaceCard className="mt-8 flex min-h-[30vh] items-center justify-center">
            <div className="space-y-3 text-center">
              <div className="serene-spinner mx-auto h-11 w-11 border-4" />
              <p className="text-sm text-[var(--theme-muted)]">Looking for matching rides...</p>
            </div>
          </SurfaceCard>
        ) : trips.length === 0 ? (
          <div className="serene-empty mt-8 px-6 py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-bg-soft)]">
              <span className="h-3 w-3 rounded-full bg-[var(--theme-primary)]" />
            </div>
            <p className="mt-4 text-2xl font-medium text-[var(--theme-ink)]">No rides match this search yet.</p>
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              Try a different city pair or broaden the day to see more options.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </PageIntro>
    </div>
  );
}
