import { and, eq, sql } from "drizzle-orm";
import { NewParticipant, Participant, ParticipantNickname, Uuid } from "~/lib/types";
import { db } from "../db";
import { participants } from "~/lib/db/schema";

export async function insertParticipant(newParticipant: NewParticipant) {
  return (await db.insert(participants).values(newParticipant).returning())[0];
}

export async function incrementParticipantPoints(
  transaction: typeof db,
  participantId: Uuid,
  points: number,
) {
  await transaction
    .update(participants)
    .set({
      totalPoints: sql`${participants.totalPoints} + ${points}`,
      lastPointIncrement: points,
    })
    .where(eq(participants.id, participantId));
}

export async function existsParticipantWithNickname(matchId: Uuid, nickname: ParticipantNickname) {
  const result = await db
    .select()
    .from(participants)
    .where(and(eq(participants.matchId, matchId), eq(participants.nickname, nickname)));

  return result.length > 0;
}

export async function selectParticipantById(participantId: Uuid): Promise<Participant | undefined> {
  return (await db.select().from(participants).where(eq(participants.id, participantId)))[0];
}
