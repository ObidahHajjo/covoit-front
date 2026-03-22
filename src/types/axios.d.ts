import "axios";

/**
 * Axios request-config augmentations used by the frontend API clients.
 */

declare module "axios" {
    /** Extra request flag used to disable the global loader. */
    export interface InternalAxiosRequestConfig {
        showGlobalLoader?: boolean;
    }

    /** Extra request flag used to disable the global loader. */
    export interface AxiosRequestConfig {
        showGlobalLoader?: boolean;
    }
}
