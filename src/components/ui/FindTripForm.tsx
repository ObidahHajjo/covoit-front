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
        <form
            onSubmit={onSubmit}
            className="rounded-[34px] border border-white/70 bg-white/65 p-5 text-[#18352d] shadow-[0_28px_80px_-44px_rgba(24,53,45,0.38)] backdrop-blur-xl sm:p-6"
        >
            <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-[24px] bg-[#fffaf6] p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">From</p>
                    <CityAutocomplete
                        label="Departure city"
                        placeholder="Search departure city"
                        selectedOption={startingCity}
                        onSelect={onStartingCityChange}
                    />
                </div>

                <div className="rounded-[24px] bg-[#fffaf6] p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">To</p>
                    <CityAutocomplete
                        label="Arrival city"
                        placeholder="Search arrival city"
                        selectedOption={arrivalCity}
                        onSelect={onArrivalCityChange}
                    />
                </div>

                <div className="space-y-2 rounded-[24px] bg-[#fffaf6] p-4 xl:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">
                        Departure day
                    </label>
                    <input
                        type="date"
                        value={tripDate}
                        onChange={(e) => onTripDateChange(e.target.value)}
                        className="w-full rounded-[20px] border border-[#e5d8c8] bg-white px-4 py-3.5 text-sm text-[#18352d] outline-none transition focus:border-[#f3b8ab] focus:ring-4 focus:ring-[#f7d7cf]"
                    />
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                    type="submit"
                    disabled={!startingCity || !arrivalCity}
                    className="rounded-full bg-[#f26f5a] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Search rides
                </button>

                <button
                    type="button"
                    onClick={onShowAll}
                    className="rounded-full border border-[#d8cfc2] bg-[#fff9f4] px-4 py-3.5 text-sm font-semibold text-[#335246] transition hover:border-[#f3b8ab] hover:text-[#8c4d3f]"
                >
                    Browse everything
                </button>
            </div>
        </form>
    );
}
