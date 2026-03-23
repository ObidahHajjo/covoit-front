import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FindTripForm } from "../../components/ui/Trips/FindTripForm.tsx";
import type { CityPostalOption } from "../../types/Commune";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the trip search page that collects departure, arrival, and optional travel date filters.
 *
 * @returns The trip search form and supporting page copy for browsing available rides.
 */
export default function FindTripPage() {
    const navigate = useNavigate();
    const { t } = useI18n();

    const [startingCity, setStartingCity] = useState<CityPostalOption | null>(null);
    const [arrivalCity, setArrivalCity] = useState<CityPostalOption | null>(null);
    const [tripDate, setTripDate] = useState("");

    /**
     * Serializes the selected search filters and navigates to the results page.
     *
     * @param event - Form submission event from the trip search form.
     * @returns Nothing.
     */
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Only defined filters are serialized so the results page can distinguish untouched fields from explicit choices.
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
			<p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-muted)]">{t("search.title")}</p>
			<h1 className="mt-3 text-4xl font-medium leading-[1.1] text-[var(--theme-ink)] sm:text-5xl">{t("search.heading")}</h1>
			<p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("search.body")}</p>
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
