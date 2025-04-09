import { getMatchByIdOrPin } from "~/server/actions/match-actions";
import { isFailure } from "~/lib/result";
import QRCode from "qrcode";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatchByIdOrPin(id);

  // TODO: Handle error
  if (isFailure(match)) {
    return <p>error</p>;
  }

  const pin = match.data.pin;

  // TODO não consegui solucionar o problema abaixo sem usar eslint-disable-next-line.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const qrCodeBase64 = await QRCode.toDataURL(pin);

  const participants = [];
  const hasPlayers = participants.length > 0;

  const withPlayer = participants.length;
  const withoutPlayer = (
    <h2 className="border-2xl mt-4 w-96 rounded-lg bg-purple-500 p-4 text-center text-background">
      Aguardando jogadores...
    </h2>
  );

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full justify-center gap-4">
        <div className="flex flex-col items-start justify-center rounded-lg bg-background px-16 py-2">
          <h1 className="">PIN da partida</h1>
          <h2 className="text-5xl font-bold">{pin}</h2>
        </div>
        <div className="max-w-96">
          <div className="flex flex-col items-center gap-4 rounded-lg border p-4 shadow-md">
            <h2 className="text-lg font-semibold">QR Code</h2>
            <Image src={qrCodeBase64} alt="QR Code" width={160} height={160} />
          </div>
        </div>
      </div>

      <div>{hasPlayers ? withPlayer : withoutPlayer}</div>
    </div>
  );
}
