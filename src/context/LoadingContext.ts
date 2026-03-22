import { createContext, useContext } from "react";

/**
 * Describes the value shared by the global loading context.
 */
export type LoadingContextType = {
    pendingRequests: number;
    startLoading: () => void;
    stopLoading: () => void;
    isLoading: boolean;
};

/**
 * Stores the loading context consumed by interceptors and loading indicators.
 */
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Returns the global loading context value.
 *
 * @returns The shared loading context API.
 * @throws Error When the hook is used outside `LoadingProvider`.
 */
export function useLoading(): LoadingContextType {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error("useLoading must be used inside LoadingProvider");
    }

    return context;
}
