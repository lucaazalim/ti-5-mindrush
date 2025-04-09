"use client";

import BackButton from "~/app/dashboard/_components/BackButton";
import { ROUTES } from "~/lib/constants";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { CircleX, Play } from "lucide-react";
import PageTitle from "~/app/dashboard/_components/PageTitle";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import { startMatch } from "~/server/actions/match-actions";
import { isFailure } from "~/lib/result";
import { toast } from "sonner";

const participantsMock = [
  "Luca",
  "Pedro",
  "João",
  "Maria",
  "Wanessa",
  "Fernando",
  "Hugo",
  "Cleiton",
  "João Silva",
  "Eduardo",
];

export default function WaitingPage() {
  const setMatch = useMatchStore((state) => state.setMatch);
  const match = useMatchStore((state) => state.match);
  const qrcode = useMatchStore((state) => state.qrCodeBase64);

  async function onStartMatchButtonClicked() {
    const result = await startMatch(match.id);

    if (isFailure(result)) {
      toast.error(result.error);
      return;
    }

    setMatch(result.data);
    toast("Partida iniciada!");
  }

  return (
    <div className="flex flex-col gap-3">
      <BackButton href={ROUTES.QUIZZES} className="w-fit" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-5">
          <div className="flex-grow content-center rounded-lg bg-background p-10">
            <h1 className="">PIN da partida</h1>
            <h2 className="text-5xl font-bold">{match.pin}</h2>
          </div>
          <div className="flex flex-row items-center justify-between gap-5 rounded-lg bg-background">
            <Image
              src={qrcode}
              alt="QR Code"
              width={160}
              height={160}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-grow flex-row gap-5 rounded-lg bg-background p-10">
          <Button
            size="lg"
            className="grow"
            onClick={onStartMatchButtonClicked}
          >
            <Play />
            Iniciar partida
          </Button>
          <Button variant="outline" size="lg" className="grow">
            <CircleX />
            Cancelar partida
          </Button>
        </div>
        <PageTitle>Participantes ({participantsMock.length})</PageTitle>
        <div className="grid grid-cols-4 gap-5">
          {participantsMock.map((participant) => (
            <div
              key={participant}
              className="flex flex-row items-center rounded-lg bg-primary/20"
            >
              <div className="rounded-bl-lg rounded-tl-lg bg-primary p-3">
                <img
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${participant}`}
                  className="size-16 drop-shadow-lg"
                />
              </div>
              <span className="truncate p-3 font-semibold">{participant}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
