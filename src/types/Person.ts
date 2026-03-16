import type { Car } from "./Car";

export interface Person  {
    id: number;
    pseudo?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    role_id?: number;
    is_active?: boolean;
    car_id?: number | null;
    car?: Car | null;
}

export interface UpdateMePayload  {
    pseudo?: string|null;
    first_name?: string|null;
    last_name?: string|null;
    phone?: string|null;
    car_id?: number | null;
}