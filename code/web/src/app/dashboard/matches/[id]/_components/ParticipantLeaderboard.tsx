import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { getAvatarUrl } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

export default function ParticipantLeaderboard() {
  const match = useMatchStore((state) => state.match);

  return (
    <div className="flex flex-col gap-3 px-3">
      <ol>
        {match.participants.slice(0, 10).map((participant, index) => (
          <li key={participant.id}>
            {index != 0 && <Separator className="my-3" />}
            <div className="flex flex-row items-center gap-5">
              <span className="w-8 text-2xl font-bold">{index + 1}º</span>
              <Avatar className="size-16 border-2">
                <AvatarImage src={getAvatarUrl(participant)} alt={participant.nickname} />
              </Avatar>
              <span className="text-2xl font-semibold">{participant.nickname}</span>
              {participant.lastPointIncrement > 0 && (
                <span className="font-bold text-green-500">
                  +{participant.lastPointIncrement.toLocaleString("pt-BR")}
                </span>
              )}
              <span className="ml-auto text-2xl font-bold">
                {participant.totalPoints.toLocaleString("pt-BR")}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
