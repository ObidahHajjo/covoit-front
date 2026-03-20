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
            <div className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="mb-8 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">Find a trip</p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">Search the network with the same warm, community-first tone.</h1>
                    <p className="mt-4 text-sm leading-6 text-[#4c655b] sm:text-base">Pick a departure, an arrival, and an optional date to find the ride that fits best.</p>
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
