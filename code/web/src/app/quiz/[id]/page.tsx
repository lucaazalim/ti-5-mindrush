import PageTitle from "~/app/dashboard/_components/PageTitle";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div>
      <PageTitle>Quiz</PageTitle>
      <p>Quiz</p>
    </div>
  );
}