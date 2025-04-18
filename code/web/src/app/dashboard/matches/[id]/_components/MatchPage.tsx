"use client";

import { useEffect } from "react";
import RunningPage from "~/app/dashboard/matches/[id]/_components/RunningPage";
import WaitingPage from "~/app/dashboard/matches/[id]/_components/WaitingPage";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import pusherClient from "~/lib/pusher";

export default function MatchPage() {
  const match = useMatchStore((state) => state.match);
  const setChannel = useMatchStore((state) => state.setChannel);

  useEffect(() => {
    const channel = pusherClient.subscribe(`match-${match.id}`);
    setChannel(channel);

    return () => {
      pusherClient.unsubscribe(`match-${match.id}`);
      setChannel(undefined);
    };
  }, []);

  if (match.state === "WAITING") {
    return <WaitingPage />;
  } else if (match.state === "RUNNING") {
    return <RunningPage />;
  }

  return null;
}
