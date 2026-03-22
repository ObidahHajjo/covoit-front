import { createContext, useContext } from "react";

/**
 * Represents the global error payload displayed by shared feedback UI.
 */
type GlobalError = {
  message: string;
};

/**
 * Describes the value exposed by the global error context.
 */
export type ErrorContextType = {
  error: GlobalError | null;
  showError: (message: string) => void;
  clearError: () => void;
};

/**
 * Stores the app-wide error context consumed by global feedback components.
 */
export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

/**
 * Returns the global error context value.
 *
 * @returns The shared error context API.
 * @throws Error When the hook is used outside `ErrorProvider`.
 */
export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("useError must be used inside ErrorProvider");
  }

  return context;
}
