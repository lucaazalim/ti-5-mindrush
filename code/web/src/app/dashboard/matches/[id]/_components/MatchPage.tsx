"use client";

import { useEffect } from "react";
import RunningPage from "~/app/dashboard/matches/[id]/_components/RunningPage";
import WaitingPage from "~/app/dashboard/matches/[id]/_components/WaitingPage";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import pusherClient from "~/lib/pusher-client";
import { Match } from "~/lib/types";
import EndedPage from "./EndedPage";

const Components: Record<Match["state"], React.FC> = {
  WAITING: WaitingPage,
  RUNNING: RunningPage,
  ENDED: EndedPage,
};

export default function MatchPage() {
  const match = useMatchStore((state) => state.match);
  const setChannel = useMatchStore((state) => state.setChannel);

  useEffect(() => {
    const channelName = `presence-match-${match.id}`;
    const channel = pusherClient.subscribe(channelName);

    setChannel(channel);

    return () => {
      pusherClient.unsubscribe(channelName);
      setChannel(undefined);
    };
  }, [match.id, setChannel]);

  console.log(match.state);

  const Component = Components[match.state];
  return Component ? <Component /> : null;
}
