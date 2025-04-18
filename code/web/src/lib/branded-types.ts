import { z } from "zod";
import { matchPinParser, participantNicknameParser, uuidParser } from "./parsers";

export type Uuid = z.infer<typeof uuidParser>;

export function isUuid(uuid: string): uuid is Uuid {
  return uuidParser.safeParse(uuid).success;
}

export type ParticipantNickname = z.infer<typeof participantNicknameParser>;

export function isParticipantNickname(nickname: string): nickname is ParticipantNickname {
  return nickname.length > 0 && nickname.length <= 20;
}

export type MatchPin = z.infer<typeof matchPinParser>;

export function isMatchPin(pin: string): pin is MatchPin {
  return matchPinParser.safeParse(pin).success;
}
