import { useEffect, useCallback, useMemo, useState } from "react";
import { getMe } from "../features/auth/authApi";
import { apiClient } from "../app/apiClient";
import type { AuthUser } from "../types/MeResponse";
import { AuthContext, type AuthStatus } from "../context/AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [user, setUser] = useState<AuthUser | null>(null);

    const refreshMe = useCallback(async () => {
        try {
            const me = await getMe();
            setUser(me);
            setStatus("authenticated");
            return;
        } catch {
            try {
                await apiClient.post("/auth/refresh");
                const me = await getMe();
                setUser(me);
                setStatus("authenticated");
                return;
            } catch {
                setUser(null);
                setStatus("guest");
            }
        }
    }, []);

    const logoutLocal = useCallback(() => {
        setUser(null);
        setStatus("guest");
    }, []);

    useEffect(() => {
        void refreshMe();
    }, [refreshMe]);

    const value = useMemo(
        () => ({
            status,
            user,
            refreshMe,
            logoutLocal,
        }),
        [status, user, refreshMe, logoutLocal]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}