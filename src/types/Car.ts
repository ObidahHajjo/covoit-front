/**
 * Car domain types used by vehicle management screens.
 */

/** Car entity returned by the API. */
export interface Car  {
    id: number;
    license_plate?: string;
    seats?: number | null;
    model?: {
        id: number;
        name: string;
        brand?: {
            id: number;
            name: string;
        };
    };
    color?: {
        name: string;
        hex_code: string;
    }
}

/** Payload used to create a new car. */
export interface CreateCarPayload  {
    brand?: {
        name: string;
    };
    type?: {
        name: string;
    };
    model?: {
        name: string;
    };
    seats?: number;
    carregistration?: string;
    color?: {
        name: string;
        hex_code: string;
    };
}

/** Payload used to update an existing car. */
export type UpdateCarPayload = CreateCarPayload;
