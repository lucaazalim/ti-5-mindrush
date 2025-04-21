import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import {
  type accounts,
  type matches,
  type participants,
  type questionAlternatives,
  type questions,
  type quizAnswers,
  type quizzes,
  type sessions,
  type users,
  type verificationTokens,
} from "~/server/db/schema";
import {
  matchPinParser,
  participantNicknameParser,
  questionAndAlternativesParser,
  updateQuizParser,
  uuidParser,
} from "./parsers";

export type SimpleError = {
  message: string;
  status: number;
};

// Select types (e.g. for reading from DB)
export type User = InferSelectModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type Session = InferSelectModel<typeof sessions>;
export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type Quiz = InferSelectModel<typeof quizzes>;
export type Question = InferSelectModel<typeof questions>;
export type QuestionAlternative = InferSelectModel<typeof questionAlternatives>;
export type Match = InferSelectModel<typeof matches>;
export type Participant = InferSelectModel<typeof participants>;
export type QuizAnswer = InferSelectModel<typeof quizAnswers>;

// Insert types (e.g. for creating or updating entries)
export type NewUser = InferInsertModel<typeof users>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewVerificationToken = InferInsertModel<typeof verificationTokens>;
export type NewQuiz = InferInsertModel<typeof quizzes>;
export type NewQuestion = InferInsertModel<typeof questions>;
export type NewQuestionAlternative = InferInsertModel<typeof questionAlternatives>;
export type NewMatch = InferInsertModel<typeof matches>;
export type NewParticipant = InferInsertModel<typeof participants>;
export type NewQuizAnswer = InferInsertModel<typeof quizAnswers>;

// Joined data types

export type PopulatedMatch = Match & {
  quiz: QuizWithQuestionsAndAlternatives;
  participants: Participant[];
};

export type QuizWithQuestionsAndAlternatives = Quiz & {
  questions: QuestionWithAlternatives[];
};

export type QuestionWithAlternatives = Question & {
  alternatives: QuestionAlternative[];
};

export type QuestionQuizAlternativeWithoutCorrect = Omit<QuestionAlternative, "correct">;

export type QuestionWithAlternativesWithoutCorrect = Question & {
  alternatives: QuestionQuizAlternativeWithoutCorrect[];
};

// Other data types

export type UpdateQuiz = z.infer<typeof updateQuizParser>;

export type QuizWithQuestionCount = Quiz & { questionCount: number };

export type QuestionWithRawAlternatives = Question & {
  alternatives: string[];
  correctAlternativeIndex: number;
};

export type RawQuestionsWithAlternatives = z.infer<typeof questionAndAlternativesParser>;

export type Uuid = z.infer<typeof uuidParser>;

export function isUuid(uuid: string): uuid is Uuid {
  return uuidParser.safeParse(uuid).success;
}

export type ParticipantNickname = z.infer<typeof participantNicknameParser>;

export function isParticipantNickname(nickname: string): nickname is ParticipantNickname {
  return participantNicknameParser.safeParse(nickname).success;
}

export type MatchPin = z.infer<typeof matchPinParser>;

export function isMatchPin(pin: string): pin is MatchPin {
  return matchPinParser.safeParse(pin).success;
}
