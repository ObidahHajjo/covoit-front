import type {City} from "./City.ts";

export interface Address {
    id: number;
    street: string;
    street_number: string;
    city_id: number;
    city?: City;
}