import { useMemo, useState, type ReactNode } from "react";
import { LoadingContext } from "../context/LoadingContext.ts";

/**
 * Provides global request-loading state derived from the number of active calls.
 *
 * @param props - Component props.
 * @param props.children - Descendant React nodes that consume loading state.
 * @returns The loading context provider wrapping the provided children.
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
    const [pendingRequests, setPendingRequests] = useState(0);

    function startLoading(): void {
        setPendingRequests((prev) => prev + 1);
    }

    function stopLoading(): void {
        setPendingRequests((prev) => Math.max(0, prev - 1));
    }

    const value = useMemo(
        () => ({
            pendingRequests,
            startLoading,
            stopLoading,
            isLoading: pendingRequests > 0,
        }),
        [pendingRequests],
    );

    return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}
