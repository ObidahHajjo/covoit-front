import { useCallback, useEffect, useState } from "react";
import {
  fetchWaitingSessions,
  fetchActiveAdminSessions,
  adminJoinSession,
  type AdminSupportSession,
} from "../../features/admin/useAdminSupportChatApi";
import { useAdminSupportRealtime } from "../../features/admin/useAdminSupportRealtime";

export type SessionTab = "waiting" | "active" | "closed";

/**
 * Hook to manage the admin support inbox state.
 * Handles fetching waiting and active sessions, and joining sessions.
 *
 * @returns State and handlers for the admin support inbox interface.
 */
export function useAdminSupportInbox() {
  const [waitingSessions, setWaitingSessions] = useState<AdminSupportSession[]>([]);
  const [activeSessions, setActiveSessions] = useState<AdminSupportSession[]>([]);
  const [activeTab, setActiveTab] = useState<SessionTab>("waiting");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches waiting and active support sessions from the API.
   *
   * @param silent - If true, prevents the loading spinner from showing.
   */
  const loadSessions = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const [waiting, active] = await Promise.all([
        fetchWaitingSessions(),
        fetchActiveAdminSessions(),
      ]);
      setWaitingSessions(waiting);
      setActiveSessions(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useAdminSupportRealtime((event) => {
    const typed = event as { type?: string; data?: unknown };
    if (typed.type === "session.created" || typed.type === "message.sent") {
      void loadSessions(true);
    }
  });

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  /**
   * Joins a waiting support session as an admin.
   *
   * @param sessionId - The ID of the session to join.
   * @returns The updated session details.
   */
  const handleJoinSession = useCallback(async (sessionId: number) => {
    try {
      setError(null);
      const updated = await adminJoinSession(sessionId);
      setWaitingSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setActiveSessions((prev) => [...prev, updated]);
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to join session";
      setError(msg);
      throw err;
    }
  }, []);

  return {
    waitingSessions,
    activeSessions,
    activeTab,
    setActiveTab,
    loading,
    error,
    refresh: loadSessions,
    handleJoinSession,
  };
}
