import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { API_BASE_URL } from "../../app/apiClient";

let echoInstance: Echo<"reverb"> | null = null;

type WindowWithPusher = Window & typeof globalThis & {
  Pusher?: typeof Pusher;
};

function resolveHost() {
  return (import.meta.env.VITE_REVERB_HOST as string | undefined) || window.location.hostname;
}

function resolvePort(forceTls: boolean) {
  const raw = forceTls
    ? (import.meta.env.VITE_REVERB_WSS_PORT as string | undefined) || (import.meta.env.VITE_REVERB_PORT as string | undefined)
    : (import.meta.env.VITE_REVERB_WS_PORT as string | undefined) || (import.meta.env.VITE_REVERB_PORT as string | undefined);

  return Number(raw || (forceTls ? 443 : 8080));
}

export function getChatEcho() {
  if (typeof window === "undefined") {
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const forceTls = ((import.meta.env.VITE_REVERB_SCHEME as string | undefined) || window.location.protocol.replace(":", "")) === "https";

  (window as WindowWithPusher).Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: (import.meta.env.VITE_REVERB_APP_KEY as string | undefined) || "local-key",
    wsHost: resolveHost(),
    wsPort: resolvePort(false),
    wssPort: resolvePort(true),
    forceTLS: forceTls,
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
    withCredentials: true,
  });

  return echoInstance;
}
