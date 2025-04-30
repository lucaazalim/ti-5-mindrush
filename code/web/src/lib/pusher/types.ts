import { Participant } from "../types";

export interface EventMap {
  "new-participant-event": { participant: Participant };
  "next-match-question-event": never;
  "question-answered-event": never;
  "match-ended-event": never;
}
