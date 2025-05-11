import Pusher from "pusher";
import { env } from "~/env";
import { getMatchChannel } from "~/lib/utils";
import { Match } from "../types";
import { EventMap } from "./types";

export const pusherSender = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export async function publishMatchEvent<K extends keyof EventMap>(
  match: Pick<Match, "id">,
  name: K,
  ...args: EventMap[K] extends never ? [] : [data: EventMap[K]]
) {
  const data = args[0];
  return pusherSender.trigger(getMatchChannel(match), name, data ?? {});
}
