/**
 * Generic API response wrapper types.
 */

/** Standard API wrapper containing the response payload. */
export interface ApiResponse<T>  {
    data: T;
}
