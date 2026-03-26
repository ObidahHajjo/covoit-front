import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../../helpers/FormatDateTime.ts";
import type { Trip } from "../../../types/Trip.ts";
import { PageIntro, SurfaceCard } from "../../common/SerenePrimitives.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";

type Props = {
  trips: Trip[];
  loading: boolean;
};

/**
 * Render a single trip result card.
 *
 * @param props - Component props for the trip result card.
 * @param props.trip - Trip displayed in the search results.
 * @returns The rendered trip result link.
 */
function TripCard({ trip }: { trip: Trip }) {
  const { t } = useI18n();
  const from = trip.departure_address?.city?.name ?? t("common.unknown");
  const to = trip.arrival_address?.city?.name ?? t("common.unknown");

  return (
    <Link to={`/trips/${trip.id}`} className="serene-card serene-card-hover group flex gap-3 p-5 text-[var(--theme-ink)] sm:gap-4">
      {/* Timeline left rail */}
      <div className="flex flex-col items-center pt-1">
        <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[var(--theme-primary)] bg-[var(--theme-surface)]" />
        <span className="min-h-4 w-px flex-1 bg-[var(--theme-line-strong)]" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-[var(--theme-primary)]" />
      </div>

      {/* Content right of timeline */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="serene-kicker">{t("search.routePreview")}</p>
            <p className="mt-1 text-lg font-bold leading-tight text-[var(--theme-ink)] sm:text-xl">{from}</p>
          </div>
          <span className="serene-chip shrink-0">
            <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)]" />
            {t("search.seatCount", { count: trip.available_seats, suffix: trip.available_seats !== 1 ? "s" : "" })}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--theme-muted-strong)] sm:text-sm">
          <span className="serene-soft rounded-md px-3 py-2">📅 {formatDateTimeRaw(trip.departure_time)}</span>
          <span className="serene-soft rounded-md px-3 py-2">📍 {trip.distance_km} km</span>
          <span className="serene-soft rounded-md px-3 py-2">{t("search.tripNumber", { id: trip.id })}</span>
          <span className="serene-soft rounded-md px-3 py-2">{t("search.pickupDetails")}</span>
        </div>

        <p className="mt-2 text-lg font-bold leading-tight text-[var(--theme-ink)] sm:text-xl">{to}</p>
      </div>
    </Link>
  );
}

/**
 * Display the list of trips returned by a search.
 *
 * @param props - Component props for the trip-results view.
 * @param props.trips - Trips returned by the current search.
 * @param props.loading - Whether search results are still loading.
 * @returns The rendered trip-results section.
 */
export function TripResultsSection({ trips, loading }: Props) {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <PageIntro
        eyebrow={t("search.tripSearch")}
        title={t("search.chooseRide")}
        description={t("search.compare")}
      >
        {loading ? (
          <SurfaceCard className="mt-8 flex min-h-[30vh] items-center justify-center">
            <div className="space-y-3 text-center">
              <div className="serene-spinner mx-auto h-11 w-11 border-4" />
              <p className="text-sm text-[var(--theme-muted)]">{t("search.lookingForMatches")}</p>
            </div>
          </SurfaceCard>
        ) : trips.length === 0 ? (
          <div className="serene-empty mt-8 px-6 py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-bg-soft)]">
              <span className="h-3 w-3 rounded-full bg-[var(--theme-primary)]" />
            </div>
            <p className="mt-4 text-2xl font-medium text-[var(--theme-ink)]">{t("search.noMatches")}</p>
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              {t("search.tryDifferent")}
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
