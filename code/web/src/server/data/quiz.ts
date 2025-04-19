import { eq } from "drizzle-orm";
import { Quiz, Uuid } from "~/lib/types";
import { db } from "../db";
import { matches, quizzes } from "../db/schema";

export async function selectQuizByMatchId(matchId: Uuid): Promise<Quiz | undefined> {
  // TODO authorization
  const result = await db
    .select({
      quiz: quizzes,
    })
    .from(quizzes)
    .innerJoin(matches, eq(matches.quizId, quizzes.id))
    .where(eq(matches.id, matchId));

  return result[0]?.quiz;
}

export async function selectQuizById(quizId: Uuid): Promise<Quiz | undefined> {
  // TODO authorization
  return (await db.select().from(quizzes).where(eq(quizzes.id, quizId)))[0];
}
