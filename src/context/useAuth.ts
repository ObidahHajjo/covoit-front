import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Returns the authentication context value.
 *
 * @returns The shared authentication context API.
 * @throws Error When the hook is used outside `AuthProvider`.
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
