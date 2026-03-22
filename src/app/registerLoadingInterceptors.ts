import type { AxiosInstance } from "axios";

/**
 * Attaches loading interceptors to an axios client and returns a cleanup helper.
 *
 * @param client - Axios instance that should drive the global loading state.
 * @param startLoading - Callback fired before a tracked request starts.
 * @param stopLoading - Callback fired after a tracked request finishes or fails.
 * @returns An object exposing an `eject` method that unregisters both interceptors.
 */
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
