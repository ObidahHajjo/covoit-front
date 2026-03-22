import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { getChatEcho } from "./chatEcho";

export function useChatRealtime(channelName: string | null, onSignal: () => void) {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  useEffect(() => {
    if (!channelName) return;

    const echo = getChatEcho();
    if (!echo) {
      setIsRealtimeConnected(false);
      return;
    }

    const connector = (echo.connector as { pusher?: Pusher }).pusher;
    const handleConnected = () => setIsRealtimeConnected(true);
    const handleDisconnected = () => setIsRealtimeConnected(false);

    connector?.connection.bind("connected", handleConnected);
    connector?.connection.bind("disconnected", handleDisconnected);

    const channel = echo.private(channelName).listen(".chat.message.sent", onSignal);

    if (connector?.connection.state === "connected") {
      setIsRealtimeConnected(true);
    }

    return () => {
      channel.stopListening(".chat.message.sent");
      echo.leaveChannel(`private-${channelName}`);
      connector?.connection.unbind("connected", handleConnected);
      connector?.connection.unbind("disconnected", handleDisconnected);
    };
  }, [channelName, onSignal]);

  return { isRealtimeConnected };
}
