import { motion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";
import PageTitle from "~/app/dashboard/_components/PageTitle";
import { useIsFirstRender } from "~/lib/hooks";
import { subscribeToEvent } from "~/lib/pusher/subscriber";
import { getAvatarUrl } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

export default function WaitingParticipants() {
  const match = useMatchStore((state) => state.match);
  const channel = useMatchStore((state) => state.channel);
  const addParticipant = useMatchStore((state) => state.addParticipant);

  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    return subscribeToEvent(channel, "new-participant-event", ({ participant }) => {
      addParticipant(participant);
    });
  }, [channel, addParticipant]);

  return (
    <>
      <PageTitle>Participantes ({match.participants.length})</PageTitle>
      <div className="grid grid-cols-4 gap-5">
        {match.participants.map((participant) => (
          <motion.div
            initial={isFirstRender ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            viewport={{ once: true }}
            key={participant.id}
            className="flex flex-row items-center rounded-lg bg-primary/20"
          >
            <div className="rounded-bl-lg rounded-tl-lg bg-primary p-3">
              <motion.div
                initial={isFirstRender ? false : { scale: 0, opacity: 0, rotate: 360 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image
                  src={getAvatarUrl(participant)}
                  className="drop-shadow-lg"
                  alt={`Avatar de ${participant.nickname}`}
                  width={50}
                  height={50}
                />
              </motion.div>
            </div>
            <span className="truncate p-3 font-semibold">{participant.nickname}</span>
          </motion.div>
        ))}
      </div>
    </>
  );
}
