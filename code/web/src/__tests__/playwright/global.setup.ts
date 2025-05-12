import { test as setup } from "@playwright/test";
import { reset } from "drizzle-seed";
import { TEST_SESSION_TOKEN } from "~/lib/constants";
import { db } from "~/lib/db/";
import * as schema from "~/lib/db/schema";

setup("reset database", async ({}) => {
  await reset(db, schema);
});

setup("seed database", async ({}) => {
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
});
