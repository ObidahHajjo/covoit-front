import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ErrorContext, type ErrorContextType } from "./useError";

/**
 * Provides app-wide error state and helpers to descendant components.
 *
 * @param props - Component props.
 * @param props.children - Descendant React nodes that consume the error context.
 * @returns The error context provider wrapping the provided children.
 */
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ErrorContextType["error"]>(null);

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
