import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ErrorContext, type ErrorContextType } from "./useError";

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
