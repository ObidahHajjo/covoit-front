import "axios";

declare module "axios" {
    export interface InternalAxiosRequestConfig {
        showGlobalLoader?: boolean;
    }

    export interface AxiosRequestConfig {
        showGlobalLoader?: boolean;
    }
}