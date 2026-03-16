import { apiClient } from "../../app/externalApiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { CommuneApiItem, CityPostalOption } from "../../types/Commune";
import type {GeoPfFeature, GeoPfSearchResponse} from "../../types/GeoPfSearchResponse.ts";

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