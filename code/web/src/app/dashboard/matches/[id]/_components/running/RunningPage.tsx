import { Circle, Diamond, Square, Triangle, User } from "lucide-react";
import { ReactTyped } from "react-typed";
import Main from "~/app/dashboard/_components/Main";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn, getAvatarUrl } from "~/lib/utils";
import { useMatchStore } from "../../_store/store-provider";
import { EndMatchButton } from "../buttons/EndMatchButton";
import CountdownBar from "./CountdownBar";
import { NextQuestionButton } from "./SkipQuestionButton";

const SymbolsAndColors = [
  { icon: Triangle, color: "bg-red-500" },
  { icon: Diamond, color: "bg-blue-500" },
  { icon: Circle, color: "bg-yellow-500" },
  { icon: Square, color: "bg-green-500" },
];

export default function RunningPage() {
  const match = useMatchStore((state) => state.match);

  const { currentQuestion } = match;

  if (!currentQuestion) {
    throw new Error("Match is running but there no current question. How did this happen?");
  }

  return (
    <>
      <Main className="flex max-w-full flex-col justify-center gap-5 px-16 py-12">
        <CountdownBar />
        <div className="flex items-center justify-between gap-5 rounded-3xl bg-background p-10">
          <ReactTyped
            className="text-6xl font-medium drop-shadow-md"
            strings={[currentQuestion.question]}
            typeSpeed={40}
            loopCount={0}
            showCursor={false}
          />
          {currentQuestion.image && (
            <picture className="place-self-end">
              <img
                src={currentQuestion.image}
                alt="Imagem da questão"
                className="h-96 w-auto rounded-3xl drop-shadow-lg"
              />
            </picture>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.alternatives.map((alternative, index) => {
            const { icon: Icon, color } = SymbolsAndColors[index]!;

            return (
              <div
                key={alternative.id}
                className={cn(
                  "flex flex-row items-center gap-3 rounded-3xl p-5 text-2xl text-background",
                  color,
                )}
              >
                <Icon className="size-8 fill-current text-white drop-shadow-md" />
                <span className="text-white">{alternative.answer}</span>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-3 rounded-3xl bg-background p-5">
          <div className="relative col-span-2 h-16 overflow-hidden">
            <div className="absolute flex h-full flex-row items-center gap-1.5">
              <div className="flex h-full w-16 flex-col items-center justify-center rounded-full border-2 p-1.5 font-semibold">
                <User className="size-4" />
                {match.participants.length}
              </div>
              {match.participants.slice(0, 20).map((participant) => (
                <TooltipProvider key={participant.id}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Avatar className="size-16 border-2">
                        <AvatarImage
                          src={getAvatarUrl(participant.nickname)}
                          alt={participant.nickname}
                        />
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participant.nickname}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white to-transparent to-30%" />
          </div>
          <NextQuestionButton />
          <EndMatchButton />
        </div>
      </Main>
    </>
  );
}
