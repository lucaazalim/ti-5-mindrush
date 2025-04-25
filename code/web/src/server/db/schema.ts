import { eq, relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { QUESTION_TYPES } from "~/lib/constants";
import { ParticipantNickname, Uuid } from "~/lib/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mindrush_${name}`);

export const users = createTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom().$type<Uuid>(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id)
      .$type<Uuid>(),
    type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 }).notNull().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id)
      .$type<Uuid>(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const quizzes = createTable("quiz", {
  id: uuid("id").primaryKey().defaultRandom().$type<Uuid>(),
  educatorId: uuid("educator_id")
    .$type<Uuid>()
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", {
    enum: ["BLANK", "THEME_GENERATED", "PDF_GENERATED"],
  }).notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const questions = createTable(
  "question",
  {
    id: uuid("id").primaryKey().defaultRandom().$type<Uuid>(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" })
      .$type<Uuid>(),
    type: text("type", { enum: QUESTION_TYPES }).notNull(),
    image: text("image"),
    question: text("question").notNull(),
    timeLimit: integer("time_limit").notNull(),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueOrderIndex: uniqueIndex().on(table.order, table.quizId),
  }),
);

export const questionAlternatives = createTable(
  "question_alternative",
  {
    id: uuid("id").primaryKey().defaultRandom().$type<Uuid>(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" })
      .$type<Uuid>(),
    answer: text("answer").notNull(),
    correct: boolean("correct").notNull(),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueCorrectAnswerIndex: uniqueIndex()
      .on(table.questionId, table.correct)
      .where(eq(table.correct, sql`true`)),
    uniqueOrderIndex: uniqueIndex().on(table.questionId, table.order),
  }),
);

export const matches = createTable(
  "match",
  {
    id: uuid("id").primaryKey().defaultRandom().$type<Uuid>(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" })
      .$type<Uuid>(),
    pin: text("pin").notNull(),
    status: text("status", {
      enum: ["WAITING", "RUNNING", "ENDED"],
    }).notNull(),
    currentQuestionId: uuid("current_question_id")
      .references(() => questions.id, { onDelete: "set null" })
      .$type<Uuid | null>(),
    currentQuestionEndsAt: timestamp("current_question_ends_at"),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueActiveMatchPerQuiz: uniqueIndex("unique_active_match_per_quiz")
      .on(table.quizId)
      .where(sql`${table.status} in ('WAITING', 'RUNNING')`),
  }),
);

export const participants = createTable(
  "participant",
  {
    id: uuid("id").primaryKey().defaultRandom().$type<Uuid>(),
    nickname: text("nickname").notNull().$type<ParticipantNickname>(),
    total_points: integer("total_points").notNull().default(0),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id)
      .$type<Uuid>(),
  },
  (table) => ({
    uniqueNicknameIndex: unique().on(table.nickname, table.matchId),
  }),
);

export const quizAnswers = createTable(
  "quiz_answer",
  {
    id: uuid("id").primaryKey().defaultRandom().$type<Uuid>(),
    participantId: uuid("participant_id")
      .notNull()
      .references(() => participants.id)
      .$type<Uuid>(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id)
      .$type<Uuid>(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id)
      .$type<Uuid>(),
    alternative: uuid("alternative_id")
      .notNull()
      .references(() => questionAlternatives.id)
      .$type<Uuid>(),
    correct: boolean("correct").notNull(),
    points: integer("points").notNull(),
    time: integer("time").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueParticipantAnswerIndex: unique().on(table.participantId, table.questionId, table.matchId),
  }),
);
