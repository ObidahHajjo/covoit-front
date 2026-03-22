/**
 * Types describing GeoPF geocoding responses.
 */

/** GeoPF geocoding search response. */
export interface GeoPfSearchResponse {
    type: "FeatureCollection";
    features: GeoPfFeature[];
    query: string;
}

/** Single address feature returned by GeoPF. */
export interface GeoPfFeature {
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    properties: {
        label: string;
        score: number;
        id: string;
        banId: string;
        type: string;
        name: string;
        postcode: string;
        citycode: string;
        x: number;
        y: number;
        city: string;
        context: string;
        importance: number;
        _type: string;
        population?: number;
        municipality?: string;
        street?: string;
        housenumber?: string;
    };
}
