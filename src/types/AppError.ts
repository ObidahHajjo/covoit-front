/**
 * Normalized error types used across the application.
 */

/** Normalized application error shape. */
export interface AppError {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    status?: number;
}
