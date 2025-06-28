"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import BackButton from "~/app/dashboard/_components/BackButton";
import Container from "~/app/dashboard/_components/Container";
import Main from "~/app/dashboard/_components/Main";
import { useMatchStore } from "~/app/dashboard/matches/[id]/_store/store-provider";
import { ROUTES } from "~/lib/constants";
import { EndMatchButton } from "./EndMatchButton";
import QuizDescription from "./QuizDescription";
import { StartMatchButton } from "./StartMatchButton";
import WaitingParticipantsList from "./WaitingParticipantsList";

export default function WaitingPage() {
  const match = useMatchStore((state) => state.match);
  const qrcode = useMatchStore((state) => state.qrCodeBase64);

  return (
    <Main className="flex flex-col gap-5">
      <BackButton href={ROUTES.QUIZZES} className="w-fit" />
      <QuizDescription />
      <div className="grid grid-cols-[0.4fr,0.4fr,0.2fr] gap-5">
        <Container className="flex-grow content-center p-10 text-xl">
          <Download className="mr-1.5 inline" />
          <span>
            Download the <span className="font-bold">MindRush</span> app to participate in this
            match.
          </span>
        </Container>
        <Container
          className="flex flex-col items-center justify-center rounded-3xl border-2 bg-background p-10"
          role="group"
          aria-labelledby="pin-label"
          aria-describedby="pin-value"
        >
          <span id="pin-label">Match PIN</span>
          <span id="pin-value" className="text-5xl font-black">
            {match.pin}
          </span>
        </Container>
        <Container className="flex flex-row items-center justify-center gap-5 p-1">
          <Image
            src={qrcode}
            alt="QR Code"
            width={180}
            height={180}
            className="rounded-lg dark:invert"
          />
        </Container>
      </div>
      <Container className="flex flex-grow flex-row gap-5">
        <StartMatchButton />
        <EndMatchButton />
      </Container>
      <WaitingParticipantsList />
    </Main>
  );
}
