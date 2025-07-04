import Container from "~/app/dashboard/_components/Container";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { getAvatarUrl } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

type Props = {
  fromIndexInclusive?: number;
  toIndexExclusive?: number;
};

export default function ParticipantLeaderboard({
  fromIndexInclusive = 0,
  toIndexExclusive = 5,
}: Props) {
  const match = useMatchStore((state) => state.match);
  const participants = match.participants.slice(fromIndexInclusive, toIndexExclusive);

  if (!participants.length) {
    return null;
  }

  return (
    <Container className="flex flex-col gap-3 px-10">
      <ol>
        {participants.map((participant, index) => {
          const showLastPointIncrement =
            match.currentQuestion && participant.lastPointIncrement > 0;
          const position = index + fromIndexInclusive + 1;

          return (
            <li key={participant.id}>
              {index != 0 && <Separator className="my-3" />}
              <div className="flex flex-row items-center gap-5">
                <span className="w-8 text-2xl font-bold">{position}º</span>
                <Avatar className="size-16 border-2">
                  <AvatarImage src={getAvatarUrl(participant)} alt={participant.nickname} />
                </Avatar>
                <span className="text-2xl font-semibold">{participant.nickname}</span>
                {showLastPointIncrement && (
                  <span className="font-bold text-green-500">
                    +{participant.lastPointIncrement.toLocaleString("pt-BR")}
                  </span>
                )}
                <span className="ml-auto text-2xl font-bold">
                  {participant.totalPoints.toLocaleString("pt-BR")}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
