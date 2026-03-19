import { createContext, useContext } from "react";

type GlobalError = {
  message: string;
};

export type ErrorContextType = {
  error: GlobalError | null;
  showError: (message: string) => void;
  clearError: () => void;
};

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("useError must be used inside ErrorProvider");
  }

  return context;
}
