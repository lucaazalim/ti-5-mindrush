"use client";

import { useEffect } from "react";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import pusherClient from "~/lib/pusher/subscriber";
import { MatchStatus } from "~/lib/types";
import { getMatchChannel } from "~/lib/utils";
import EndedPage from "./EndedPage";
import RunningPage from "./RunningPage";
import SoundEffectsPlayer from "./SoundEffectsPlayer";
import WaitingPage from "./WaitingPage";

const Components: Record<MatchStatus, React.FC> = {
  WAITING: WaitingPage,
  RUNNING: RunningPage,
  ENDED: EndedPage,
};

export default function MatchPage() {
  const match = useMatchStore((state) => state.match);
  const setChannel = useMatchStore((state) => state.setChannel);

  useEffect(() => {
    const channelName = getMatchChannel(match.id);
    const channel = pusherClient.subscribe(channelName);

    setChannel(channel);

    return () => {
      pusherClient.unsubscribe(channelName);
      setChannel(undefined);
    };
  }, [match.id, setChannel]);

  const Component = Components[match.status];

  if (!Component) {
    throw new Error(`No component found for match status: ${match.status}`);
  }

  return (
    <>
      <SoundEffectsPlayer />
      <Component />
    </>
  );
}
