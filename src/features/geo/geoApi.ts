import { apiClient } from "../../app/externalApiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { CommuneApiItem, CityPostalOption } from "../../types/Commune";
import type {GeoPfFeature, GeoPfSearchResponse} from "../../types/GeoPfSearchResponse.ts";

/**
 * Searches French communes by name or postal code.
 *
 * @param query Free-text query or five-digit postal code entered by the user.
 * @returns A normalized list of city and postal-code options derived from the API response.
 */
export async function searchCommunes(query: string): Promise<CityPostalOption[]> {
    try {
        const trimmed = query.trim();

        if (trimmed.length < 2) {
            return [];
        }

        const url = /^\d{5}$/.test(trimmed)
            ? `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(trimmed)}&fields=nom,codesPostaux,code&limit=8`
            : `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(trimmed)}&fields=nom,codesPostaux,code&boost=population&limit=8`;

        const { data } = await apiClient.get<CommuneApiItem[]>(url, {
            showGlobalLoader: false,
        });

        return mapCommunesToCityPostalOptions(data);
    } catch (e) {
        throw new Error(extractApiErrorMessage(e));
    }
}

/**
 * Searches address suggestions from the GeoPF geocoding API.
 *
 * @param query Free-text address query submitted by the user.
 * @returns The list of matching GeoPF address features.
 */
export async function  searchAddress(query:string): Promise<GeoPfFeature[]>
{
    try{
        const url = `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(query)}&index=address&limit=5&returntruegeometry=false`;
        const { data } = await apiClient.get<GeoPfSearchResponse>(url, {
            showGlobalLoader: false,
        });

        return (data.features);
    }catch(e){
        throw new Error(extractApiErrorMessage(e));
    }
}

/**
 * Flattens commune results into unique city and postal-code options.
 *
 * @param communes Raw commune items returned by the external geo API.
 * @returns A deduplicated list of city and postal-code options.
 */
function mapCommunesToCityPostalOptions(
    communes: CommuneApiItem[],
): CityPostalOption[] {
    const unique = new Map<string, CityPostalOption>();

    for (const commune of communes) {
        for (const postalCode of commune.codesPostaux) {
            const key = `${commune.code}-${postalCode}`;

            if (!unique.has(key)) {
                unique.set(key, {
                    cityName: commune.nom,
                    postalCode,
                    cityCode: commune.code,
                });
            }
        }
    }

    return Array.from(unique.values());
}
