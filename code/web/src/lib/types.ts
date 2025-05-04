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

// Utility types

type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type DataAccessOptions = {
  internal?: boolean;
};

// Infered select types

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

// Infered insert types

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

// Joined types

export type PopulatedMatch = Match & {
  quiz: QuizWithQuestionsAndAlternatives;
  currentQuestion:
    | (Question & {
        alternatives: (QuestionAlternative & {
          count: number;
        })[];
      })
    | null;
  participants: Participant[];
};

export type MatchWithQuizTitle = Match & {
  quizTitle: string;
};

export type QuizWithQuestionCountAndActiveMatch = Quiz & {
  questionCount: number;
  activeMatch: Match | null;
};

export type QuizWithQuestionsAndAlternatives = Quiz & {
  questions: QuestionWithAlternatives[];
};

export type QuestionWithAlternatives = Question & {
  alternatives: QuestionAlternative[];
};

export type QuestionWithAlternativesWithoutCorrect = Question & {
  alternatives: StrictOmit<QuestionAlternative, "isCorrect">[];
};

export type QuestionWithRawAlternatives = Question & {
  alternatives: string[];
  correctAlternativeIndex: number;
};

// Other types

export type MatchStatus = Match["status"];
export type QuestionType = Question["type"];

export type UpdateQuiz = z.infer<typeof updateQuizParser>;

export type RawQuestionsWithAlternatives = z.infer<typeof questionAndAlternativesParser>;

// Branded types

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
