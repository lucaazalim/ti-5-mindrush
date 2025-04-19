import { eq } from "drizzle-orm";
import { Participant, Uuid } from "~/lib/types";
import { db } from "../db";
import { participants } from "../db/schema";

export async function getParticipantById(id: Uuid): Promise<Participant | undefined> {
  return (await db.select().from(participants).where(eq(participants.id, id)))[0];
}
