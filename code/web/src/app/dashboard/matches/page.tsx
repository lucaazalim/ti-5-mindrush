import { unauthorized } from "next/navigation";
import { auth } from "src/lib/auth";
import Main from "../_components/Main";
import PageTitle from "../_components/PageTitle";
import { selectAllMatches } from "~/lib/data/match";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const allMatches = await selectAllMatches();

  return (
    <Main>
      <div className="flex flex-row justify-between">
        <PageTitle className="mt-1">Suas partidas</PageTitle>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {allMatches?.length > 0 ? (
          <DataTable columns={columns} data={allMatches} />
        ) : (
          <p className="text-muted-foreground">Nenhuma partida encontrada.</p>
        )}
      </div>
    </Main>
  );
}
