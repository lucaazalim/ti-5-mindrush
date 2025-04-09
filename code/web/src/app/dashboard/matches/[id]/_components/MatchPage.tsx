"use client";

import WaitingPage from "~/app/dashboard/matches/[id]/_components/WaitingPage";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import RunningPage from "~/app/dashboard/matches/[id]/_components/RunningPage";

export default function MatchPage() {
  const match = useMatchStore((state) => state.match);

  if (match.state === "WAITING") {
    return <WaitingPage />;
  } else if (match.state === "RUNNING") {
    return <RunningPage />;
  }

  return null;
}
