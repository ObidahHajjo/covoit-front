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
    /**
     * Starts the global loader for tracked requests before they are sent.
     *
     * @param config - Outgoing axios request configuration.
     * @returns The unchanged request config.
     */
    const requestInterceptorId = client.interceptors.request.use(
        (config) => {
            if (config.showGlobalLoader !== false) {
                startLoading();
            }
            return config;
        },
        /**
         * Stops the global loader when a tracked request fails before dispatch.
         *
         * @param error - Axios request error.
         * @returns A rejected promise containing the same error.
         */
        (error) => {
            stopLoading();
            return Promise.reject(error);
        },
    );

    /**
     * Stops the global loader after tracked responses settle.
     *
     * @param response - Axios response for the completed request.
     * @returns The unchanged response.
     */
    const responseInterceptorId = client.interceptors.response.use(
        (response) => {
            if (response.config.showGlobalLoader !== false) {
                stopLoading();
            }
            return response;
        },
        /**
         * Stops the global loader when a tracked response rejects.
         *
         * @param error - Axios response error.
         * @returns A rejected promise containing the same error.
         */
        (error) => {
            if (error.config?.showGlobalLoader !== false) {
                stopLoading();
            }
            return Promise.reject(error);
        },
    );

    return {
        /**
         * Unregisters the request and response interceptors created by this helper.
         *
         * @returns Nothing.
         */
        eject() {
            client.interceptors.request.eject(requestInterceptorId);
            client.interceptors.response.eject(responseInterceptorId);
        },
    };
}
