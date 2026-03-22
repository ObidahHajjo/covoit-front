import type {City} from "./City.ts";

/**
 * Address types shared by trip and profile domain models.
 */

/** Address entity used by trips and person data. */
export interface Address {
    id: number;
    street: string;
    street_number: string;
    city_id: number;
    city?: City;
}
