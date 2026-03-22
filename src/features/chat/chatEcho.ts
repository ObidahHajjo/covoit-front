import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { API_BASE_URL, apiClient } from "../../app/apiClient";

let echoInstance: Echo<"reverb"> | null = null;

type WindowWithPusher = Window & typeof globalThis & {
  Pusher?: typeof Pusher;
};

/**
 * Resolves the websocket host used by the Reverb broadcaster.
 *
 * @returns The configured websocket host, or the current browser hostname as a fallback.
 */
function resolveHost() {
  return (import.meta.env.VITE_REVERB_HOST as string | undefined) || window.location.hostname;
}

/**
 * Resolves the websocket port associated with the selected transport security mode.
 *
 * @param forceTls Indicates whether the secure websocket port should be resolved.
 * @returns The configured websocket port number.
 */
function resolvePort(forceTls: boolean) {
  const raw = forceTls
    ? (import.meta.env.VITE_REVERB_WSS_PORT as string | undefined) || (import.meta.env.VITE_REVERB_PORT as string | undefined)
    : (import.meta.env.VITE_REVERB_WS_PORT as string | undefined) || (import.meta.env.VITE_REVERB_PORT as string | undefined);

  return Number(raw || (forceTls ? 443 : 8080));
}

/**
 * Returns the singleton Echo client configured for authenticated chat channels.
 *
 * @returns The shared Echo instance, or `null` when executed outside the browser.
 */
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
    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        // The auth proxy keeps private-channel authorization aligned with the app's cookie-based session.
        apiClient
            .post("/broadcasting/auth-proxy", {
              socket_id: socketId,
              channel_name: channel.name,
            }, {showGlobalLoader: false})
            .then((res) => callback(null, res.data))
            .catch((err) => callback(err, null));
      },
    }),
  });

  return echoInstance;
}
