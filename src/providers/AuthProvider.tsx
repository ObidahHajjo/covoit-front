import { useEffect, useCallback, useMemo, useState } from "react";
import { getMe } from "../features/auth/authApi";
import { apiClient } from "../app/apiClient";
import type { AuthUser } from "../types/MeResponse";
import { AuthContext, type AuthStatus } from "../context/AuthContext";

/**
 * Provides authenticated user state and session refresh helpers to the app.
 *
 * @param props - Component props.
 * @param props.children - Descendant React nodes that consume auth state.
 * @returns The auth context provider wrapping the provided children.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshMe = useCallback(async (): Promise<boolean> => {
    try {
      const me = await getMe();
      setUser(me);
      setStatus("authenticated");
      return true;
    } catch {
      try {
        await apiClient.post("/auth/refresh", undefined, { showGlobalLoader: false });
        const me = await getMe();
        setUser(me);
        setStatus("authenticated");
        return true;
      } catch {
        setUser(null);
        setStatus("guest");
        return false;
      }
    }
  }, []);

  const logoutLocal = useCallback((): void => {
    setUser(null);
    setStatus("guest");
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const bootstrap = async (): Promise<void> => {
      setStatus("loading");
      await refreshMe();
    };

    void bootstrap();

    return () => controller.abort();
  }, [refreshMe]);

  const value = useMemo(
    () => ({ status, user, refreshMe, logoutLocal }),
    [status, user, refreshMe, logoutLocal]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
