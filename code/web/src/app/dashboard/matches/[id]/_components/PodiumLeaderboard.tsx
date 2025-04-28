import Image from "next/image";
import Container from "~/app/dashboard/_components/Container";
import { cn, getAvatarUrl } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

export default function PodiumLeaderboard() {
  const match = useMatchStore((state) => state.match);

  const topParticipants = match.participants.slice(0, 3);

  return (
    <Container className="flex items-end justify-center gap-10 p-10 pt-20">
      {topParticipants.map((participant, index) => (
        <div
          key={participant.id}
          className={cn("w-[13rem] rounded-t-3xl text-white", {
            "order-0 h-[15rem] bg-gray-400": index === 1,
            "order-1 h-[20rem] bg-yellow-500": index === 0,
            "order-2 h-[10rem] bg-orange-900": index === 2,
          })}
        >
          <div className="-mt-16 flex flex-col items-center justify-start gap-2">
            <Image
              src={getAvatarUrl(participant)}
              alt={participant.nickname}
              width={100}
              height={100}
              className="rounded-full drop-shadow-lg"
            />
            <span className="rounded-lg bg-background px-3 py-2 text-xl font-black text-foreground">
              {participant.nickname}
            </span>
            <span className="text-lg font-bold">
              {participant.totalPoints.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      ))}
    </Container>
  );
}
