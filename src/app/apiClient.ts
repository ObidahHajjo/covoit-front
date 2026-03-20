import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL as string);

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

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

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
                    { withCredentials: true }
                );

                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
