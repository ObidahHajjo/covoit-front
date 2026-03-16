export interface Car  {
    id: number;
    license_plate?: string;
    model?: {
        id: number;
        name: string;
        seats?: number | null;
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
    brand_id?: number;
    model_name?: string;
    seats?: number;
    license_plate?: string;
    color_id?: number;
}

export type UpdateCarPayload = CreateCarPayload;