import axios from "axios";

/**
 * Represents field-level validation errors returned by the backend.
 */
export type ApiFieldErrors = Record<string, string[]>;

/**
 * Represents the supported shapes for API error payloads.
 */
export type ApiErrorPayload =
    | {
    error?: string;
    details?: string;
    message?: string;
    fields?: ApiFieldErrors;
    constraint?: string | null;
    duplicated_fields?: string[];
    duplicated_values?: string[];
}
    | string
    | null
    | undefined;

/**
 * Extracts the most relevant human-readable message from an API error.
 *
 * @param err - Unknown error value thrown by an API request or local code.
 * @returns The best user-facing error message available.
 */
export function extractApiErrorMessage(err: unknown): string {
    if (!axios.isAxiosError(err)) {
        return err instanceof Error ? err.message : "Unexpected error";
    }

    const data = err.response?.data as ApiErrorPayload;

    if (data && typeof data === "object") {
        const details = typeof data.details === "string" ? data.details : null;
        const message = typeof data.message === "string" ? data.message : null;
        const fields = isFieldErrors(data.fields) ? data.fields : undefined;

        const firstFieldMessage = fields
            ? Object.values(fields).find(
                (messages) => Array.isArray(messages) && messages.length > 0
            )?.[0]
            : null;

        return firstFieldMessage ?? details ?? message ?? err.message ?? "Request failed";
    }

    if (typeof data === "string" && data.trim() !== "") {
        return data;
    }

    return err.message || "Request failed";
}

/**
 * Extracts backend field validation errors from an API error response.
 *
 * @param err - Unknown error value thrown by an API request.
 * @returns A map of field names to validation messages.
 */
export function extractApiFieldErrors(err: unknown): ApiFieldErrors {
    if (!axios.isAxiosError(err)) return {};

    const data = err.response?.data as ApiErrorPayload;

    if (data && typeof data === "object" && isFieldErrors(data.fields)) {
        return data.fields;
    }

    return {};
}

/**
 * Checks whether an unknown value matches the API field-errors object shape.
 *
 * @param value - Candidate value to validate.
 * @returns `true` when the value is a valid field-error map.
 */
function isFieldErrors(value: unknown): value is ApiFieldErrors {
    if (!value || typeof value !== "object") return false;

    return Object.values(value).every(
        (messages) =>
            Array.isArray(messages) &&
            messages.every((message) => typeof message === "string")
    );
}
