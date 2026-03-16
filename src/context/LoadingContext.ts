import { createContext, useContext } from "react";

export type LoadingContextType = {
    pendingRequests: number;
    startLoading: () => void;
    stopLoading: () => void;
    isLoading: boolean;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading(): LoadingContextType {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error("useLoading must be used inside LoadingProvider");
    }

    return context;
}