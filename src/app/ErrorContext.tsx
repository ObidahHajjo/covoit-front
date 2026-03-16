import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type GlobalError = {
    message: string;
};

type ErrorContextType = {
    error: GlobalError | null;
    showError: (message: string) => void;
    clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<GlobalError | null>(null);

    const showError = useCallback((message: string) => {
        setError({ message });
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = useMemo(
        () => ({
            error,
            showError,
            clearError,
        }),
        [error, showError, clearError]
    );

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);

    if (!context) {
        throw new Error("useError must be used inside ErrorProvider");
    }

    return context;
}