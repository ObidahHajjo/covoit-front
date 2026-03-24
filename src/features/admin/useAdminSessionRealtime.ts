import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { getChatEcho } from "../chat/chatEcho";

/**
 * Subscribes to a specific support session channel for real-time messages and typing.
 *
 * @param sessionId - The support chat session ID to subscribe to.
 * @param onSignal - Callback invoked when a message or typing event arrives.
 * @returns An object containing the current realtime connection state.
 */
export function useAdminSessionRealtime(
  sessionId: number | null,
  onSignal: (payload?: unknown) => void
) {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const onSignalRef = useRef(onSignal);

  useEffect(() => {
    onSignalRef.current = onSignal;
  }, [onSignal]);

  useEffect(() => {
    if (!sessionId) return;

    const echo = getChatEcho();
    if (!echo) return;

    const connector = (echo.connector as { pusher?: Pusher }).pusher;

    const handleConnected = () => setIsRealtimeConnected(true);
    const handleDisconnected = () => setIsRealtimeConnected(false);

    connector?.connection.bind("connected", handleConnected);
    connector?.connection.bind("disconnected", handleDisconnected);

    const channel = echo.private(`support.session.${sessionId}`);

    channel.listen(".support.message.sent", (payload: unknown) => {
      onSignalRef.current({ type: "message.sent", data: payload });
    });

    channel.listen(".support.typing", (payload: unknown) => {
      onSignalRef.current({ type: "typing", data: payload });
    });

    if (connector?.connection.state === "connected") {
      queueMicrotask(() => setIsRealtimeConnected(true));
    }

    return () => {
      channel.stopListening(".support.message.sent");
      channel.stopListening(".support.typing");
      echo.leaveChannel(`private-support.session.${sessionId}`);
      connector?.connection.unbind("connected", handleConnected);
      connector?.connection.unbind("disconnected", handleDisconnected);
    };
  }, [sessionId]);

  return { isRealtimeConnected };
}
