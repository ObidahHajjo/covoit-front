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
		className="rounded-[24px] border border-[#eee] bg-white p-5 text-[#222] sm:p-6"
	>
		<div className="grid gap-5 xl:grid-cols-2">
		<div className="rounded-[16px] bg-[#fafafa] p-4">
			<p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-[#888]">From</p>
			<CityAutocomplete
			label="Departure city"
			placeholder="Search departure city"
			selectedOption={startingCity}
			onSelect={onStartingCityChange}
			/>
		</div>

		<div className="rounded-[16px] bg-[#fafafa] p-4">
			<p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-[#888]">To</p>
			<CityAutocomplete
			label="Arrival city"
			placeholder="Search arrival city"
			selectedOption={arrivalCity}
			onSelect={onArrivalCityChange}
			/>
		</div>

		<div className="space-y-2 rounded-[16px] bg-[#fafafa] p-4 xl:col-span-2">
			<label className="block text-xs font-medium uppercase tracking-[0.15em] text-[#888]">
			Departure day
			</label>
			<input
			type="date"
			value={tripDate}
			onChange={(e) => onTripDateChange(e.target.value)}
			className="w-full rounded-[12px] border border-[#eee] bg-white px-4 py-3.5 text-sm text-[#222] outline-none transition focus:border-[#222]"
			/>
		</div>
		</div>

		<div className="mt-5 grid gap-3 sm:grid-cols-2">
		<button
			type="submit"
			disabled={!startingCity || !arrivalCity}
			className="rounded-full bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
		>
			Search rides
		</button>

		<button
			type="button"
			onClick={onShowAll}
			className="rounded-full border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#222] transition hover:border-[#ccc]"
		>
			Browse everything
		</button>
		</div>
	</form>
    );
}
