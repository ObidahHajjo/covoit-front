import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { getChatEcho } from "./chatEcho";

export function useSupportChatRealtime(sessionId: number | null, onSignal: (payload?: unknown) => void) {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const onSignalRef = useRef(onSignal);

  useEffect(() => {
    onSignalRef.current = onSignal;
  }, [onSignal]);

  useEffect(() => {
    if (!sessionId) return;

    const echo = getChatEcho();
    if (!echo) {
      return;
    }

    const connector = (echo.connector as { pusher?: Pusher }).pusher;

    const handleConnected = () => setIsRealtimeConnected(true);
    const handleDisconnected = () => setIsRealtimeConnected(false);

    connector?.connection.bind("connected", handleConnected);
    connector?.connection.bind("disconnected", handleDisconnected);

    const channel = echo.private(`support.session.${sessionId}`);
    
    channel.listen(".support.message.sent", (payload: unknown) => {
      onSignalRef.current(payload);
    });

    channel.listen(".support.typing", (payload: unknown) => {
      onSignalRef.current(payload);
    });

    if (connector?.connection.state === "connected") {
      setIsRealtimeConnected(true);
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
