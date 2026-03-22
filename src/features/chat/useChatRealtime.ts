import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { getChatEcho } from "./chatEcho";

/**
 * Subscribes to a private chat channel and exposes the realtime connection state.
 *
 * @param channelName Private channel name to subscribe to, or `null` to disable realtime updates.
 * @param onSignal Callback invoked whenever a chat message event is received.
 * @returns An object describing whether the realtime connection is currently established.
 */
export function useChatRealtime(channelName: string | null, onSignal: (payload?: unknown) => void) {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const onSignalRef = useRef(onSignal);

  useEffect(() => {
    onSignalRef.current = onSignal;
  }, [onSignal]);

  useEffect(() => {
    if (!channelName) return;

    const echo = getChatEcho();
    if (!echo) {
      setIsRealtimeConnected(false);
      return;
    }

    const connector = (echo.connector as { pusher?: Pusher }).pusher;

    /**
     * Marks the realtime channel as connected.
     *
     * @returns Nothing.
     */
    const handleConnected = () => setIsRealtimeConnected(true);

    /**
     * Marks the realtime channel as disconnected.
     *
     * @returns Nothing.
     */
    const handleDisconnected = () => setIsRealtimeConnected(false);

    connector?.connection.bind("connected", handleConnected);
    connector?.connection.bind("disconnected", handleDisconnected);

    const channel = echo.private(channelName).listen(".chat.message.sent", (payload: unknown) => {
      onSignalRef.current(payload);
    });

    if (connector?.connection.state === "connected") {
      setIsRealtimeConnected(true);
    }

    return () => {
      channel.stopListening(".chat.message.sent");
      echo.leaveChannel(`private-${channelName}`);
      connector?.connection.unbind("connected", handleConnected);
      connector?.connection.unbind("disconnected", handleDisconnected);
    };
  }, [channelName]);

  return { isRealtimeConnected };
}
