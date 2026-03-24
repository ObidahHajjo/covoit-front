import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { getChatEcho } from "../chat/chatEcho";

/**
 * Subscribes to the admin support channel for real-time session and message notifications.
 *
 * @param onSignal - Callback invoked when a new event arrives on the admin channel.
 * @returns An object containing the current realtime connection state.
 */
export function useAdminSupportRealtime(onSignal: (payload?: unknown) => void) {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const onSignalRef = useRef(onSignal);

  useEffect(() => {
    onSignalRef.current = onSignal;
  }, [onSignal]);

  useEffect(() => {
    const echo = getChatEcho();
    if (!echo) return;

    const connector = (echo.connector as { pusher?: Pusher }).pusher;

    const handleConnected = () => setIsRealtimeConnected(true);
    const handleDisconnected = () => setIsRealtimeConnected(false);

    connector?.connection.bind("connected", handleConnected);
    connector?.connection.bind("disconnected", handleDisconnected);

    const channel = echo.private("support.admins");

    channel.listen(".support.session.created", (payload: unknown) => {
      onSignalRef.current({ type: "session.created", data: payload });
    });

    channel.listen(".support.message.sent", (payload: unknown) => {
      onSignalRef.current({ type: "message.sent", data: payload });
    });

    if (connector?.connection.state === "connected") {
      queueMicrotask(() => setIsRealtimeConnected(true));
    }

    return () => {
      channel.stopListening(".support.session.created");
      channel.stopListening(".support.message.sent");
      echo.leaveChannel("private-support.admins");
      connector?.connection.unbind("connected", handleConnected);
      connector?.connection.unbind("disconnected", handleDisconnected);
    };
  }, []);

  return { isRealtimeConnected };
}
