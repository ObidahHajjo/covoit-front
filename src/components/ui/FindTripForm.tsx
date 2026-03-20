import type { FormEvent } from "react";
import CityAutocomplete from "../../components/common/geo/CityAutocomplete";
import type { CityPostalOption } from "../../types/Commune";
import { FormField, SereneButton, SurfaceCard } from "../common/SerenePrimitives";

type Props = {
    startingCity: CityPostalOption | null;
    arrivalCity: CityPostalOption | null;
    tripDate: string;
    onStartingCityChange: (city: CityPostalOption | null) => void;
    onArrivalCityChange: (city: CityPostalOption | null) => void;
    onTripDateChange: (date: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onShowAll: () => void;
};

export function FindTripForm({
    startingCity,
    arrivalCity,
    tripDate,
    onStartingCityChange,
    onArrivalCityChange,
    onTripDateChange,
    onSubmit,
    onShowAll,
}: Props) {
  return (
    <SurfaceCard className="p-5 text-[var(--theme-ink)] sm:p-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="serene-soft p-4">
            <p className="mb-3 serene-kicker">From</p>
            <CityAutocomplete
              label="Departure city"
              placeholder="Search departure city"
              selectedOption={startingCity}
              onSelect={onStartingCityChange}
            />
          </div>

          <div className="serene-soft p-4">
            <p className="mb-3 serene-kicker">To</p>
            <CityAutocomplete
              label="Arrival city"
              placeholder="Search arrival city"
              selectedOption={arrivalCity}
              onSelect={onArrivalCityChange}
            />
          </div>

          <div className="serene-soft p-4 xl:col-span-2">
            <FormField label="Departure day">
              <input
                type="date"
                value={tripDate}
                onChange={(e) => onTripDateChange(e.target.value)}
                className="serene-input"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SereneButton type="submit" disabled={!startingCity || !arrivalCity} className="w-full">
            Search rides
          </SereneButton>

          <SereneButton type="button" variant="secondary" onClick={onShowAll} className="w-full">
            Browse everything
          </SereneButton>
        </div>
      </form>
    </SurfaceCard>
  );
}
