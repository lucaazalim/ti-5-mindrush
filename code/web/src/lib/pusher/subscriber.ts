import Pusher, { Channel } from "pusher-js";
import { env } from "~/env";
import { EventMap } from "./types";

const pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "/api/pusher/auth/educator",
});

export function subscribeToEvent<K extends keyof EventMap>(
  channel: Channel | undefined,
  event: K,
  callback: (data: EventMap[K]) => void,
): () => void {
  channel?.bind(event, callback);
  return () => {
    channel?.unbind(event, callback);
  };
}

export default pusherClient;
