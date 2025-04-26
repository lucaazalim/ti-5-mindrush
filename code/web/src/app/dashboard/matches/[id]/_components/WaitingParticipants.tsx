import Image from "next/image";
import { useEffect } from "react";
import PageTitle from "~/app/dashboard/_components/PageTitle";
import { getAvatarUrl } from "~/lib/utils";
import { NewParticipantEvent } from "~/server/event-publisher";
import { useMatchStore } from "../_store/store-provider";

export default function WaitingParticipants() {
  const match = useMatchStore((state) => state.match);
  const channel = useMatchStore((state) => state.channel);
  const addParticipant = useMatchStore((state) => state.addParticipant);

  useEffect(() => {
    channel?.bind("new-participant-event", (data: NewParticipantEvent) => {
      addParticipant(data.participant);
    });
  }, [channel, addParticipant]);

  return (
    <>
      <PageTitle>Participantes ({match.participants.length})</PageTitle>
      <div className="grid grid-cols-4 gap-5">
        {match.participants.map((participant) => (
          <div key={participant.id} className="flex flex-row items-center rounded-lg bg-primary/20">
            <div className="rounded-bl-lg rounded-tl-lg bg-primary p-3">
              <Image
                src={getAvatarUrl(participant.nickname)}
                className="drop-shadow-lg"
                alt={`Avatar de ${participant.nickname}`}
                width={50}
                height={50}
              />
            </div>
            <span className="truncate p-3 font-semibold">{participant.nickname}</span>
          </div>
        ))}
      </div>
    </>
  );
}
