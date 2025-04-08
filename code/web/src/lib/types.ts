import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  type accounts,
  type matches,
  type participants,
  type questions,
  type quizAnswers,
  type quizQuestionsAlternatives,
  type quizzes,
  type sessions,
  type users,
  type verificationTokens,
} from "~/server/db/schema";

// Select types (e.g. for reading from DB)
export type User = InferSelectModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type Session = InferSelectModel<typeof sessions>;
export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type Quiz = InferSelectModel<typeof quizzes>;
export type Question = InferSelectModel<typeof questions>;
export type QuestionQuizAlternative = InferSelectModel<
  typeof quizQuestionsAlternatives
>;
export type Match = InferSelectModel<typeof matches>;
export type Participant = InferSelectModel<typeof participants>;
export type QuizAnswer = InferSelectModel<typeof quizAnswers>;

// Insert/Update types (e.g. for creating or updating entries)
export type NewUser = InferInsertModel<typeof users>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewVerificationToken = InferInsertModel<typeof verificationTokens>;
export type NewQuiz = InferInsertModel<typeof quizzes>;
export type NewQuestion = InferInsertModel<typeof questions>;
export type NewQuestionQuizAlternative = InferInsertModel<
  typeof quizQuestionsAlternatives
>;
export type UpdateQuiz = Partial<Pick<Quiz, "title" | "description">>;
export type NewMatch = InferInsertModel<typeof matches>;
export type NewParticipant = InferInsertModel<typeof participants>;
export type NewQuizAnswer = InferInsertModel<typeof quizAnswers>;
