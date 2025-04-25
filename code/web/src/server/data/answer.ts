import { NewQuizAnswer } from "~/lib/types";
import { db } from "../db";
import { quizAnswers } from "../db/schema";

export async function insertQuizAnswer(quizAnswer: NewQuizAnswer) {
  await db.insert(quizAnswers).values(quizAnswer);
}
