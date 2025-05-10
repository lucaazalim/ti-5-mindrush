import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
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
} from "~/lib/db/schema";

// Utility types

type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type RequireDefined<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

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
