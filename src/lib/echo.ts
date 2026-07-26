import Echo from "laravel-echo";
import Pusher from "pusher-js";
import api from "./axios";

// Make Pusher available globally for Laravel Echo
if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

export const echo =
  typeof window !== "undefined"
    ? new Echo({
        broadcaster: "reverb",
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "docubrain-key",
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
        wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
        wssPort: Number(process.env.NEXT_PUBLIC_REVERB_WSS_PORT) || 8080,
        forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
        enabledTransports: ["ws", "wss"],
        authorizer: (channel: any, options: any) => {
          return {
              authorize: (socketId: any, callback: any) => {
                  api.post('/broadcasting/auth', {
                      socket_id: socketId,
                      channel_name: channel.name
                  })
                  .then(response => {
                      callback(false, response.data);
                  })
                  .catch(error => {
                      callback(true, error);
                  });
              }
          };
      },
      })
    : null;
