import { useEffect } from "react";
import { useSound } from "~/lib/hooks";
import { subscribeToEvent } from "~/lib/pusher/subscriber";
import { useMatchStore } from "../_store/store-provider";

export default function SoundEffectsPlayer() {
  const channel = useMatchStore((state) => state.channel);
  const popSound = useSound("pop.mp3");
  const startSound = useSound("start.mp3");

  useEffect(() => {
    return subscribeToEvent(channel, "new-participant-event", popSound);
  });

  useEffect(() => {
    return subscribeToEvent(channel, "next-match-question-event", startSound);
  });

  useEffect(() => {
    return subscribeToEvent(channel, "question-answered-event", startSound);
  });

  return null;
}
