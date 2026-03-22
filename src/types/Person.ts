/**
 * Person domain types used by profile and trip features.
 */

import type { Car } from "./Car";

/** Person entity returned by profile and trip endpoints. */
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

/** Partial payload used to update the current profile. */
export interface UpdateMePayload  {
    pseudo?: string|null;
    first_name?: string|null;
    last_name?: string|null;
    phone?: string|null;
    car_id?: number | null;
}
