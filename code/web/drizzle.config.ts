import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["mindrush_*"],
} satisfies Config;
