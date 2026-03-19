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
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find a Trip</h1>
                <p className="mt-1 text-sm text-slate-400">Search by city and date</p>
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
    );
}