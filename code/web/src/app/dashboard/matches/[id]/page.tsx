import { notFound } from "next/navigation";
import QRCode from "qrcode";
import MatchPage from "~/app/dashboard/matches/[id]/_components/MatchPage";
import { MatchStoreProvider } from "~/app/dashboard/matches/[id]/_store/store-provider";
import { isUuid } from "~/lib/types";
import { selectPopulatedMatchById } from "~/lib/data/match";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isUuid(id)) {
    throw new Error("O ID da partida informado é inválido.");
  }

  const match = await selectPopulatedMatchById(id);

  if (!match) {
    notFound();
  }

  // This is a workaround and should be fixed in the future.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const qrCodeBase64 = await QRCode.toDataURL(match.pin);

  const timeLeft = match.currentQuestionEndsAt
    ? Math.max(0, match.currentQuestionEndsAt.getTime() - new Date().getTime())
    : undefined;

  return (
    <MatchStoreProvider match={match} qrCodeBase64={qrCodeBase64} timeLeft={timeLeft}>
      <MatchPage />
    </MatchStoreProvider>
  );
}
