import { resetDatabase, seedDatabase } from "~/lib/data/reset-and-seed";

export async function GET() {
  await resetDatabase();
  await seedDatabase();

  return new Response("Database reset/seed successfully.", {
    status: 200,
  });
}
