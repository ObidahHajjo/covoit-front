import { useEffect } from "react";
import { apiClient } from "./app/apiClient";
import { apiClient as externalApiClient } from "./app/externalApiClient";
import { useLoading } from "./context/LoadingContext";

/**
 * Mounts axios loading interceptors for both internal and external API clients.
 *
 * @returns `null` because this provider only performs side effects.
 */
export function AxiosInterceptorProvider() {
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const requestInterceptor1 = apiClient.interceptors.request.use(
            (config) => {
                if (config.showGlobalLoader !== false) {
                    startLoading();
                }
                return config;
            },
            (error) => {
                stopLoading();
                return Promise.reject(error);
            },
        );

        const responseInterceptor1 = apiClient.interceptors.response.use(
            (response) => {
                stopLoading();
                return response;
            },
            (error) => {
                stopLoading();
                return Promise.reject(error);
            },
        );

        const requestInterceptor2 = externalApiClient.interceptors.request.use(
            (config) => {
                if (config.showGlobalLoader !== false) {
                    startLoading();
                }
                return config;
            },
            (error) => {
                stopLoading();
                return Promise.reject(error);
            },
        );

        const responseInterceptor2 = externalApiClient.interceptors.response.use(
            (response) => {
                stopLoading();
                return response;
            },
            (error) => {
                stopLoading();
                return Promise.reject(error);
            },
        );

        return () => {
            apiClient.interceptors.request.eject(requestInterceptor1);
            apiClient.interceptors.response.eject(responseInterceptor1);
            externalApiClient.interceptors.request.eject(requestInterceptor2);
            externalApiClient.interceptors.response.eject(responseInterceptor2);
        };
    }, [startLoading, stopLoading]);

    return null;
}
