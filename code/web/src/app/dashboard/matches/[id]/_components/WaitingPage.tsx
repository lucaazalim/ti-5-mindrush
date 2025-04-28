"use client";

import Image from "next/image";
import BackButton from "~/app/dashboard/_components/BackButton";
import Container from "~/app/dashboard/_components/Container";
import Main from "~/app/dashboard/_components/Main";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import { ROUTES } from "~/lib/constants";
import { EndMatchButton } from "./EndMatchButton";
import QuizDescription from "./QuizDescription";
import { StartMatchButton } from "./StartMatchButton";
import WaitingParticipants from "./WaitingParticipants";

export default function WaitingPage() {
  const match = useMatchStore((state) => state.match);
  const qrcode = useMatchStore((state) => state.qrCodeBase64);

  return (
    <Main className="flex flex-col gap-5">
      <BackButton href={ROUTES.QUIZZES} className="w-fit" />
      <QuizDescription />
      <div className="flex flex-row gap-5">
        <Container className="flex-grow content-center p-10">
          <h1 className="">PIN da partida</h1>
          <h2 className="text-5xl font-bold">{match.pin}</h2>
        </Container>
        <Container className="flex flex-row items-center justify-between gap-5 p-1">
          <Image
            src={qrcode}
            alt="QR Code"
            width={160}
            height={160}
            className="rounded-lg dark:invert"
          />
        </Container>
      </div>
      <Container className="flex flex-grow flex-row gap-5">
        <StartMatchButton />
        <EndMatchButton />
      </Container>
      <WaitingParticipants />
    </Main>
  );
}
