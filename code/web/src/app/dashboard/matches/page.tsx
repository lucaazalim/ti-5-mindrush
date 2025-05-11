import { unauthorized } from "next/navigation";
import { auth } from "src/lib/auth";
import { selectAllMatches } from "~/lib/data/match";
import BackButton from "../_components/BackButton";
import Main from "../_components/Main";
import PageTitle from "../_components/PageTitle";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const allMatches = await selectAllMatches();

  return (
    <Main className="flex flex-col gap-3">
      <div>
        <BackButton />
      </div>

      <PageTitle className="mt-1">Histórico de Partidas</PageTitle>

      <div className="flex flex-col gap-5">
        {allMatches?.length > 0 ? (
          <DataTable columns={columns} data={allMatches} />
        ) : (
          <p className="text-muted-foreground">Nenhuma partida encontrada.</p>
        )}
      </div>
    </Main>
  );
}
