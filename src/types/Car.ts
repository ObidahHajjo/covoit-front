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

export type UpdateCarPayload = CreateCarPayload;
