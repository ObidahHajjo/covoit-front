import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import CityAutocomplete from "../../components/common/geo/CityAutocomplete";
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
        <section>
            <h1 className="mb-4 text-2xl font-bold">Find a Trip</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl bg-white p-4 shadow-sm"
            >
                <CityAutocomplete
                    label="Departure city"
                    placeholder="Search departure city"
                    selectedOption={startingCity}
                    onSelect={setStartingCity}
                />

                <CityAutocomplete
                    label="Arrival city"
                    placeholder="Search arrival city"
                    selectedOption={arrivalCity}
                    onSelect={setArrivalCity}
                />

                <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3"
                />

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="submit"
                        disabled={!startingCity || !arrivalCity}
                        className="rounded-xl bg-slate-900 px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Search Trips
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/find-trip/results")}
                        className="rounded-xl border px-4 py-3"
                    >
                        All Trips
                    </button>
                </div>
            </form>
        </section>
    );
}