import { reset } from "drizzle-seed";
import { db } from "~/lib/db/";
import * as schema from "~/lib/db/schema";
import { TEST_SESSION_TOKEN } from "../constants";

export async function resetAndSeedDatabase() {
  // if (env.NODE_ENV !== "development") {
  //   throw new Error(`"Resetting the database is not allowed in ${env.NODE_ENV} mode.`);
  // }

  await reset(db, schema);

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
    sessionToken: TEST_SESSION_TOKEN,
    userId: createdUser.id,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
  });
}
