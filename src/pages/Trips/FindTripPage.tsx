import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FindTripForm } from "../../components/ui/FindTripForm";
import type { CityPostalOption } from "../../types/Commune";

export default function FindTripPage() {
    const navigate = useNavigate();

    const [startingCity, setStartingCity] = useState<CityPostalOption | null>(null);
    const [arrivalCity, setArrivalCity] = useState<CityPostalOption | null>(null);
    const [tripDate, setTripDate] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const params = new URLSearchParams();

        if (startingCity) {
            params.set("startingcity", startingCity.cityName);
            params.set("startingpostalcode", startingCity.postalCode);
            params.set("startingcitycode", startingCity.cityCode);
        }

        if (arrivalCity) {
            params.set("arrivalcity", arrivalCity.cityName);
            params.set("arrivalpostalcode", arrivalCity.postalCode);
            params.set("arrivalcitycode", arrivalCity.cityCode);
        }

        if (tripDate) {
            params.set("tripdate", tripDate);
        }

        navigate(`/find-trip/results?${params.toString()}`);
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-0">
<div className="overflow-hidden rounded-[40px] border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 sm:px-7 sm:py-8">
		<div className="mb-8 max-w-3xl">
			<p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">Find a trip</p>
			<h1 className="mt-3 text-4xl font-medium leading-[1.1] text-[var(--theme-ink)] sm:text-5xl">Search the network with the same warm, community-first tone.</h1>
			<p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">Pick a departure, an arrival, and an optional date to find the ride that fits best.</p>
		</div>

                <FindTripForm
                    startingCity={startingCity}
                    arrivalCity={arrivalCity}
                    tripDate={tripDate}
                    onStartingCityChange={setStartingCity}
                    onArrivalCityChange={setArrivalCity}
                    onTripDateChange={setTripDate}
                    onSubmit={handleSubmit}
                    onShowAll={() => navigate("/find-trip/results")}
                />
            </div>
        </div>
    );
}
