import { createContext } from "react";
import type { AuthUser } from "../types/MeResponse";

/**
 * Lists the authentication lifecycle states exposed to the application.
 */
export type AuthStatus = "loading" | "authenticated" | "guest";

/**
 * Describes the value shared through the authentication context.
 */
export interface AuthContextValue {
    status: AuthStatus;
    user: AuthUser | null;
    refreshMe: () => Promise<boolean>;
    logoutLocal: () => void;
}

/**
 * Stores the authentication context consumed by route guards and protected screens.
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
