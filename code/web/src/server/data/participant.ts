import { and, eq } from "drizzle-orm";
import { NewParticipant, Participant, ParticipantNickname, Uuid } from "~/lib/types";
import { db } from "../db";
import { participants } from "../db/schema";

export async function insertParticipant(newParticipant: NewParticipant) {
  return (await db.insert(participants).values(newParticipant).returning())[0];
}

export async function existsParticipantWithNickname(matchId: Uuid, nickname: ParticipantNickname) {
  const result = await db
    .select()
    .from(participants)
    .where(and(eq(participants.matchId, matchId), eq(participants.nickname, nickname)));

  return result.length > 0;
}

export async function selectParticipantById(id: Uuid): Promise<Participant | undefined> {
  // TODO authorization
  return (await db.select().from(participants).where(eq(participants.id, id)))[0];
}
