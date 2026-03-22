import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getCurrentLocale } from "../i18n/config";

/**
 * Stores the normalized base URL used by the authenticated backend client.
 *
 * @returns The resolved API base URL string.
 */
export const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL as string);

/**
 * Normalizes the configured API base URL for the current frontend host.
 *
 * @param rawBaseUrl - Raw base URL read from the Vite environment.
 * @returns A normalized base URL string without a trailing slash.
 */
function resolveApiBaseUrl(rawBaseUrl: string): string {
    try {
        const url = new URL(rawBaseUrl);
        const currentHostname = window.location.hostname;
        const isLocalApiHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
        const isLocalFrontendHost = currentHostname === "localhost" || currentHostname === "127.0.0.1";

        if (isLocalApiHost && isLocalFrontendHost) {
            url.hostname = currentHostname;
        }

        return url.toString().replace(/\/$/, "");
    } catch {
        return rawBaseUrl;
    }
}

/**
 * Exposes the authenticated axios client used for application API requests.
 *
 * @returns The configured axios instance.
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    config.headers.set("Accept-Language", getCurrentLocale());
    return config;
});

/**
 * Describes an axios request config that can be retried after token refresh.
 */
type RetryableRequest = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

const AUTH_EXCLUDED_PATHS = [
    "/auth/login",
    "/auth/register",
    "/auth/me",
    "/auth/refresh",
    "/auth/forgot-password",
    "/auth/reset-password",
];

/**
 * Determines whether a request URL should bypass refresh-token retry handling.
 *
 * @param url - Request URL attached to the axios config.
 * @returns `true` when the URL belongs to an auth endpoint excluded from refresh.
 */
function isExcludedAuthPath(url?: string): boolean {
    if (!url) return false;
    return AUTH_EXCLUDED_PATHS.some((path) => url.includes(path));
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url ?? "";

        if (isExcludedAuthPath(requestUrl)) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            "Accept-Language": getCurrentLocale(),
                        },
                    }
                );

                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
