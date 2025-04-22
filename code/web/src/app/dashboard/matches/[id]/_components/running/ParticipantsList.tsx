import { User } from "lucide-react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { getAvatarUrl } from "~/lib/utils";
import { useMatchStore } from "../../_store/store-provider";

export default function ParticipantsList() {
  const match = useMatchStore((state) => state.match);

  return (
    <div className="relative col-span-2 h-16 overflow-hidden">
      <div className="absolute flex h-full flex-row items-center gap-2">
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-background to-transparent to-30%" />
    </div>
  );
}
