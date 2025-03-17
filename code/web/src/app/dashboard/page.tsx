import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await db.query.quiz.findMany();

  return data.map((quiz) => (
    <div key={quiz.id}>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
    </div>
  ));
}
