import { getMatchByIdOrPin } from "~/server/actions/match-actions";
import { isFailure } from "~/lib/result";
import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { MatchStoreProvider } from "~/app/dashboard/matches/[id]/_store/store-provider";
import MatchPage from "~/app/dashboard/matches/[id]/_components/MatchPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getMatchByIdOrPin(id);

  if (isFailure(result)) {
    notFound();
  }

  const { data: match } = result;

  // TODO não consegui solucionar o problema abaixo sem usar eslint-disable-next-line.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const qrCodeBase64 = await QRCode.toDataURL(match.pin);

  return (
    <MatchStoreProvider match={match} qrCodeBase64={qrCodeBase64}>
      <MatchPage />
    </MatchStoreProvider>
  );
}
