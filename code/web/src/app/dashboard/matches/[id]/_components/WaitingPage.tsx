"use client";

import { CircleX, Play } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import BackButton from "~/app/dashboard/_components/BackButton";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import { Button } from "~/components/ui/button";
import { ROUTES } from "~/lib/constants";
import { isFailure } from "~/lib/result";
import { endMatch, startMatch } from "~/server/actions/match-actions";
import WaitingParticipants from "./WaitingParticipants";

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

    console.log(result.data);

    setMatch(result.data);
    toast("Partida iniciada!");
  }

  async function onEndMatchButtonClicked() {
    const result = await endMatch(match.id);

    if (isFailure(result)) {
      toast.error(result.error);
      return;
    }

    setMatch({ ...match, ...result.data });
    toast("Partida encerrada!");
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
            <Image src={qrcode} alt="QR Code" width={160} height={160} className="rounded-lg" />
          </div>
        </div>
        <div className="flex flex-grow flex-row gap-5 rounded-lg bg-background p-10">
          <Button size="lg" className="grow" onClick={onStartMatchButtonClicked}>
            <Play />
            Iniciar partida
          </Button>
          <Button variant="outline" size="lg" className="grow" onClick={onEndMatchButtonClicked}>
            <CircleX />
            Encerrar partida
          </Button>
        </div>
        <WaitingParticipants />
      </div>
    </div>
  );
}
