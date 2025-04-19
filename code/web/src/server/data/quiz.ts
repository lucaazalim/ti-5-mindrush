import { eq } from "drizzle-orm";
import { Quiz, Uuid } from "~/lib/types";
import { db } from "../db";
import { quizzes } from "../db/schema";

export async function selectQuizById(id: Uuid): Promise<Quiz | undefined> {
  // TODO authorization
  return (await db.select().from(quizzes).where(eq(quizzes.id, id)))[0];
}
