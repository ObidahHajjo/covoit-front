import type { FormEvent } from "react";
import CityAutocomplete from "../../common/geo/CityAutocomplete.tsx";
import type { CityPostalOption } from "../../../types/Commune.ts";
import { FormField, SereneButton, SurfaceCard } from "../../common/SerenePrimitives.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";

type Props = {
    startingCity: CityPostalOption | null;
    arrivalCity: CityPostalOption | null;
    tripDateTime: string;
    onStartingCityChange: (city: CityPostalOption | null) => void;
    onArrivalCityChange: (city: CityPostalOption | null) => void;
    onTripDateTimeChange: (dateTime: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onShowAll: () => void;
};

/**
 * Collect trip search criteria for riders.
 *
 * @param props - Component props for the trip-search form.
 * @param props.startingCity - Selected departure city option.
 * @param props.arrivalCity - Selected arrival city option.
 * @param props.tripDateTime - Selected departure date and time.
 * @param props.onStartingCityChange - Callback fired when the departure city changes.
 * @param props.onArrivalCityChange - Callback fired when the arrival city changes.
 * @param props.onTripDateTimeChange - Callback fired when the departure date and time changes.
 * @param props.onSubmit - Form submit handler for running the search.
 * @param props.onShowAll - Callback fired when the user wants to browse all trips.
 * @returns The rendered trip-search form.
 */
export function FindTripForm({
    startingCity,
    arrivalCity,
    tripDateTime,
    onStartingCityChange,
    onArrivalCityChange,
    onTripDateTimeChange,
    onSubmit,
    onShowAll,
}: Props) {
  const { t } = useI18n();

  return (
    <SurfaceCard className="p-5 text-[var(--theme-ink)] sm:p-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="serene-soft p-4">
            <p className="mb-3 serene-kicker">{t("search.from")}</p>
            <CityAutocomplete
              label={t("search.departureCity")}
              placeholder={t("search.searchDepartureCity")}
              selectedOption={startingCity}
              onSelect={onStartingCityChange}
            />
          </div>

          <div className="serene-soft p-4">
            <p className="mb-3 serene-kicker">{t("search.to")}</p>
            <CityAutocomplete
              label={t("search.arrivalCity")}
              placeholder={t("search.searchArrivalCity")}
              selectedOption={arrivalCity}
              onSelect={onArrivalCityChange}
            />
          </div>

          <div className="serene-soft p-4 xl:col-span-2">
            <FormField label={t("search.departureDateTime")}>
              <input
                type="datetime-local"
                value={tripDateTime}
                onChange={(e) => onTripDateTimeChange(e.target.value)}
                className="serene-input"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SereneButton type="submit" disabled={!startingCity && !arrivalCity && !tripDateTime} className="w-full">
            {t("search.searchRides")}
          </SereneButton>

          <SereneButton type="button" variant="secondary" onClick={onShowAll} className="w-full">
            {t("search.browseEverything")}
          </SereneButton>
        </div>
      </form>
    </SurfaceCard>
  );
}
