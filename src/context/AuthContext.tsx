import { createContext } from "react";
import type { AuthUser } from "../types/MeResponse";

export type AuthStatus = "loading" | "authenticated" | "guest";

export interface AuthContextValue {
    status: AuthStatus;
    user: AuthUser | null;
    refreshMe: () => Promise<boolean>;
    logoutLocal: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
