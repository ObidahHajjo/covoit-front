import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ErrorContext, type ErrorContextType } from "../context/ErrorContext.ts";

/**
 * Provides app-wide error state and helpers to descendant components.
 *
 * @param props - Component props.
 * @param props.children - Descendant React nodes that consume the error context.
 * @returns The error context provider wrapping the provided children.
 */
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ErrorContextType["error"]>(null);

  /**
   * Replaces the current global error with a new message.
   *
   * @param message - Error text to expose through the shared error context.
   * @returns Nothing.
   */
  const showError = useCallback((message: string) => {
    setError({ message });
  }, []);

  /**
   * Clears any active global error message.
   *
   * @returns Nothing.
   */
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
