import { db } from "~/server/db";
import {Button} from "~/components/ui/button";
import PageTitle from "~/app/dashboard/_components/PageTitle";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await db.query.quiz.findMany();

  return (
    <div>
      <div className="flex flex-row justify-between">
        <PageTitle>Seus quizzes</PageTitle>
        <Button>Criar quiz</Button>
      </div>
      {data.map((quiz) => (
        <div key={quiz.id}>
          <h1>{quiz.title}</h1>
          <p>{quiz.description}</p>
        </div>
      ))}
    </div>
  );
}
