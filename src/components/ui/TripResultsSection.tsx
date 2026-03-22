import { Link } from "react-router-dom";
import { formatDateTimeRaw } from "../../helpers/FormatDateTime";
import type { Trip } from "../../types/Trip";
import { PageIntro, SurfaceCard } from "../common/SerenePrimitives";
import { useI18n } from "../../i18n/I18nProvider";

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
    <Link to={`/trips/${trip.id}`} className="serene-card serene-card-hover group block p-5 text-[var(--theme-ink)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="serene-kicker">{t("search.routePreview")}</p>
          <h2 className="mt-2 font-heading text-3xl font-bold leading-tight text-[var(--theme-ink)]">
            {from} - {to}
          </h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-strong)]">{formatDateTimeRaw(trip.departure_time)}</p>
        </div>
        <span className="serene-chip">
          <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)]" />
          {t("search.seatCount", { count: trip.available_seats, suffix: trip.available_seats !== 1 ? "s" : "" })}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-[var(--theme-muted-strong)] sm:grid-cols-3">
        <div className="serene-soft px-4 py-3">{t("search.tripNumber", { id: trip.id })}</div>
        <div className="serene-soft px-4 py-3">{trip.distance_km} km</div>
        <div className="serene-soft px-4 py-3">{t("search.pickupDetails")}</div>
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
