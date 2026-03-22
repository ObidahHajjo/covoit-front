import axios from "axios";

/**
 * Exposes the axios client used for third-party services without auth cookies.
 *
 * @returns The configured external axios instance.
 */
export const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: false,
});
