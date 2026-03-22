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

  /**
   * Refreshes the authenticated user, retrying once after a token refresh when needed.
   *
   * @returns A promise that resolves to `true` when the session is valid.
   */
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

  /**
   * Clears the local authentication state without issuing a logout request.
   *
   * @returns Nothing.
   */
  const logoutLocal = useCallback((): void => {
    setUser(null);
    setStatus("guest");
  }, []);

  useEffect(() => {
    /**
     * Initializes auth state when the provider mounts.
     *
     * @returns A promise that resolves once session bootstrap has completed.
     */
    const bootstrap = async (): Promise<void> => {
      setStatus("loading");
      await refreshMe();
    };

    void bootstrap();
  }, [refreshMe]);

  const value = useMemo(
    () => ({ status, user, refreshMe, logoutLocal }),
    [status, user, refreshMe, logoutLocal]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
