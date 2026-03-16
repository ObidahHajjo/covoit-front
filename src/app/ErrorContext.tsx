import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type GlobalError = {
    id: string;
    message: string;
};

type ErrorContextType = {
    errors: GlobalError[];
    showError: (message: string) => void;
    removeError: (id: string) => void;
    clearErrors: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [errors, setErrors] = useState<GlobalError[]>([]);

    const showError = useCallback((message: string) => {
        setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);
    }, []);

    const removeError = useCallback((id: string) => {
        setErrors((prev) => prev.filter((error) => error.id !== id));
    }, []);

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const value = useMemo(
        () => ({
            errors,
            showError,
            removeError,
            clearErrors,
        }),
        [errors, showError, removeError, clearErrors]
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