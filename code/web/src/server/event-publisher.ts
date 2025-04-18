import Pusher from "pusher";
import { env } from "~/env";
import { Uuid } from "~/lib/branded-types";
import { Participant } from "~/lib/types";

export const pusherSender = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET!,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

type EventName = Lowercase<`${string}-event`>;

class MatchEvent {
  matchId: Uuid;
  name: Lowercase<`${string}-event`>;

  constructor(matchId: Uuid, name: EventName) {
    this.matchId = matchId;
    this.name = name;
  }
}

export class NewParticipantEvent extends MatchEvent {
  participant: Participant;

  constructor(participant: Participant) {
    super(participant.matchId, "new-participant-event");
    this.participant = participant;
  }
}

export function callMatchEvent(matchEvent: MatchEvent) {
  pusherSender.trigger(`match-${matchEvent.matchId}`, matchEvent.name, matchEvent);
}
