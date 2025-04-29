CREATE TABLE IF NOT EXISTS "mindrush_account" (
	"user_id" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "mindrush_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_match" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"pin" text NOT NULL,
	"status" text NOT NULL,
	"current_question_id" uuid,
	"current_question_started_at" timestamp,
	"current_question_ends_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_participant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" text NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"match_id" uuid NOT NULL,
	CONSTRAINT "mindrush_participant_nickname_match_id_unique" UNIQUE("nickname","match_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_question_alternative" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"answer" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"type" text NOT NULL,
	"image" text,
	"question" text NOT NULL,
	"time_limit" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_quiz_answer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"match_id" uuid NOT NULL,
	"alternative_id" uuid NOT NULL,
	"is_correct" boolean NOT NULL,
	"points" integer NOT NULL,
	"time_taken" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "mindrush_quiz_answer_participant_id_question_id_match_id_unique" UNIQUE("participant_id","question_id","match_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_quiz" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"educator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindrush_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "mindrush_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_account" ADD CONSTRAINT "mindrush_account_user_id_mindrush_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mindrush_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_match" ADD CONSTRAINT "mindrush_match_quiz_id_mindrush_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."mindrush_quiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_match" ADD CONSTRAINT "mindrush_match_current_question_id_mindrush_question_id_fk" FOREIGN KEY ("current_question_id") REFERENCES "public"."mindrush_question"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_participant" ADD CONSTRAINT "mindrush_participant_match_id_mindrush_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."mindrush_match"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_question_alternative" ADD CONSTRAINT "mindrush_question_alternative_question_id_mindrush_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."mindrush_question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_question" ADD CONSTRAINT "mindrush_question_quiz_id_mindrush_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."mindrush_quiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_quiz_answer" ADD CONSTRAINT "mindrush_quiz_answer_participant_id_mindrush_participant_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."mindrush_participant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_quiz_answer" ADD CONSTRAINT "mindrush_quiz_answer_question_id_mindrush_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."mindrush_question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_quiz_answer" ADD CONSTRAINT "mindrush_quiz_answer_match_id_mindrush_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."mindrush_match"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_quiz_answer" ADD CONSTRAINT "mindrush_quiz_answer_alternative_id_mindrush_question_alternative_id_fk" FOREIGN KEY ("alternative_id") REFERENCES "public"."mindrush_question_alternative"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_quiz" ADD CONSTRAINT "mindrush_quiz_educator_id_mindrush_user_id_fk" FOREIGN KEY ("educator_id") REFERENCES "public"."mindrush_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mindrush_session" ADD CONSTRAINT "mindrush_session_user_id_mindrush_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mindrush_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "mindrush_account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_active_match_per_quiz" ON "mindrush_match" USING btree ("quiz_id") WHERE "mindrush_match"."status" in ($1, $2);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "mindrush_question_alternative_question_id_is_correct_index" ON "mindrush_question_alternative" USING btree ("question_id","is_correct") WHERE "mindrush_question_alternative"."is_correct" = true;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "mindrush_question_alternative_question_id_order_index" ON "mindrush_question_alternative" USING btree ("question_id","order");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "mindrush_question_order_quiz_id_index" ON "mindrush_question" USING btree ("order","quiz_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "mindrush_session" USING btree ("user_id");