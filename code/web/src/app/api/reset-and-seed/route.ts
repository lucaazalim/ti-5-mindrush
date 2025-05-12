import { resetAndSeedDatabase } from "~/lib/data/reset-and-seed";

export async function GET() {
  await resetAndSeedDatabase();

  return new Response("Database reset/seed successfully.", {
    status: 200,
  });
}
