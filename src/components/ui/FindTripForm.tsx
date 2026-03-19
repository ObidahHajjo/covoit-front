import type { FormEvent } from "react";
import CityAutocomplete from "../../components/common/geo/CityAutocomplete";
import type { CityPostalOption } from "../../types/Commune";

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
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <CityAutocomplete
                label="Departure city"
                placeholder="Search departure city"
                selectedOption={startingCity}
                onSelect={onStartingCityChange}
            />

            <CityAutocomplete
                label="Arrival city"
                placeholder="Search arrival city"
                selectedOption={arrivalCity}
                onSelect={onArrivalCityChange}
            />

            <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Date
                </label>
                <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => onTripDateChange(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                    type="submit"
                    disabled={!startingCity || !arrivalCity}
                    className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Search Trips
                </button>

                <button
                    type="button"
                    onClick={onShowAll}
                    className="rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    All Trips
                </button>
            </div>
        </form>
    );
}