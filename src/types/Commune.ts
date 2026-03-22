/**
 * Commune lookup types used by external geo services.
 */

/** Raw commune item returned by the French geo API. */
export interface CommuneApiItem {
    code: string;
    nom: string;
    codesPostaux: string[];
}

/** City and postal-code option derived from commune results. */
export interface CityPostalOption {
    cityName: string;
    postalCode: string;
    cityCode: string;
}
