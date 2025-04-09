import { getMatchByIdOrPin } from "~/server/actions/match-actions";
import { isFailure } from "~/lib/result";
import QRCode from "qrcode";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Pause, Play, SkipForward } from "lucide-react";
import PageTitle from "~/app/dashboard/_components/PageTitle";

const participantsMock = [
    "Luca", "Pedro", "João", "Maria", "Wanessa", "Fernando", "Hugo", "Cleiton", "João Silva", "Eduardo"
]

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatchByIdOrPin(id);

  if (isFailure(match)) {
    notFound();
  }

  const pin = match.data.pin;

  // TODO não consegui solucionar o problema abaixo sem usar eslint-disable-next-line.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const qrCodeBase64 = await QRCode.toDataURL(pin);

  return (
    <div className="flex flex-col gap-5 py-5">
      <div className="flex flex-row gap-5">
        <div className="flex-grow content-center rounded-lg bg-background p-10">
          <h1 className="">PIN da partida</h1>
          <h2 className="text-5xl font-bold">{pin}</h2>
        </div>
        <div className="flex flex-row items-center justify-between gap-5 rounded-lg bg-background">
          <Image
            src={qrCodeBase64}
            alt="QR Code"
            width={160}
            height={160}
            className="rounded-lg"
          />
        </div>
      </div>
      <div className="flex-grow grid grid-cols-4 gap-5 rounded-lg bg-background p-10">
        <Button>
          <Play />
          Iniciar partida
        </Button>
        <Button disabled>
          <SkipForward />
          Próxima questão
        </Button>
        <Button variant="secondary">
          <Pause />
          Pausar partida
        </Button>
        <Button variant="destructive">
          <Pause />
          Encerrar partida
        </Button>
      </div>
      <PageTitle>Participantes</PageTitle>
      <div className="grid grid-cols-5 gap-5">
        {participantsMock.map((participant) => (
            <div key={participant} className="flex flex-col justify-center items-center bg-background rounded-lg p-5">
              <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${participant}`} className="size-24 rounded-full border-2 mb-3"/>
              <span className="text-lg font-semibold">{participant}</span>
              <span>{Math.round(1000 * Math.random())} pontos</span>
            </div>
        ))}
      </div>
    </div>
  );
}
