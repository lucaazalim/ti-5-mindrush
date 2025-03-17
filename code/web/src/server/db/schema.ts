import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `mindrush_${name}`);

// Create enums
// const questionTypeEnum = pgEnum("question_type", ["QUIZ", "TRUE_OR_FALSE"]);
// const matchStateEnum = pgEnum("match_state", [
//   "WAITING",
//   "RUNNING",
//   "PAUSED",
//   "ENDED",
// ]);

// Tables
export const educator = pgTable("educator", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const quiz = pgTable("quiz", {
  id: uuid("id").primaryKey().defaultRandom(),
  educatorId: uuid("educator_id")
    .notNull()
    .references(() => educator.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const question = pgTable("question", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id")
    .notNull()
    .references(() => quiz.id),
  type: text("type").notNull(), // TODO use enum
  question: text("question").notNull(),
  timeLimit: integer("time_limit").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const questionQuizAlternatives = pgTable("question_quiz_alternatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => question.id),
  answer: text("answer").notNull(),
  correct: boolean("correct").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const match = pgTable("match", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id")
    .notNull()
    .references(() => quiz.id),
  pin: text("pin").notNull(),
  state: text("state").notNull(), // TODO use enum
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const participant = pgTable(
  "participant",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nickname: text("nickname").notNull(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id),
  },
  (table) => ({
    nicknameMatchIdx: unique().on(table.nickname, table.matchId),
  }),
);

export const quizAnswer = pgTable(
  "quiz_answer",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    participantId: uuid("participant_id")
      .notNull()
      .references(() => participant.id),
    questionId: uuid("question_id")
      .notNull()
      .references(() => question.id),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id),
    alternative: text("alternative").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    participantQuestionMatchIdx: unique().on(
      table.participantId,
      table.questionId,
      table.matchId,
    ),
  }),
);
