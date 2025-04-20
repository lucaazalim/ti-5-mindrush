import Pusher from "pusher";
import { env } from "~/env";
import { Participant, QuestionWithAlternativesWithoutCorrect, Uuid } from "~/lib/types";

export const pusherSender = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
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

export class NextMatchQuestionEvent extends MatchEvent {
  question: QuestionWithAlternativesWithoutCorrect;

  constructor(matchId: Uuid, question: QuestionWithAlternativesWithoutCorrect) {
    super(matchId, "next-match-question-event");
    this.question = question;
  }
}

export class MatchEndedEvent extends MatchEvent {
  constructor(matchId: Uuid) {
    super(matchId, "match-ended-event");
  }
}

export async function callMatchEvent(matchEvent: MatchEvent) {
  return pusherSender.trigger(`presence-match-${matchEvent.matchId}`, matchEvent.name, matchEvent);
}
