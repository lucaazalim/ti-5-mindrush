import { reset } from "drizzle-seed";
import { env } from "~/env";
import { db } from "~/lib/db/";
import * as schema from "~/lib/db/schema";

export async function resetDatabase() {
  if (env.NODE_ENV !== "development") {
    throw new Error("Resetting the database is only allowed in development mode.");
  }

  await reset(db, schema);
}

export async function seedDatabase() {
  if (env.NODE_ENV !== "development") {
    throw new Error("Seeding the database is only allowed in development mode.");
  }

  const createdUser = (
    await db
      .insert(schema.users)
      .values({
        name: "John Doe",
        email: "john@doe.com",
      })
      .returning()
  )[0];

  if (!createdUser) {
    throw new Error("Failed to create user.");
  }

  await db.insert(schema.sessions).values({
    sessionToken: "365636bc-fd6d-4d5f-a688-8af780dc3b05",
    userId: createdUser.id,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
  });
}
