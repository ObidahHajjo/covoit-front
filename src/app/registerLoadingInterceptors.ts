import type { AxiosInstance } from "axios";

export function registerLoadingInterceptors(
    client: AxiosInstance,
    startLoading: () => void,
    stopLoading: () => void,
) {
    const requestInterceptorId = client.interceptors.request.use(
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

    const responseInterceptorId = client.interceptors.response.use(
        (response) => {
            if (response.config.showGlobalLoader !== false) {
                stopLoading();
            }
            return response;
        },
        (error) => {
            if (error.config?.showGlobalLoader !== false) {
                stopLoading();
            }
            return Promise.reject(error);
        },
    );

    return {
        eject() {
            client.interceptors.request.eject(requestInterceptorId);
            client.interceptors.response.eject(responseInterceptorId);
        },
    };
}