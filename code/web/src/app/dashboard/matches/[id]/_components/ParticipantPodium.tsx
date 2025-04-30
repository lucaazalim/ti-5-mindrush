import { motion } from "motion/react";
import Image from "next/image";
import Container from "~/app/dashboard/_components/Container";
import { useSound } from "~/lib/hooks";
import { cn, getAvatarUrl } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

type PodiumMetadata = {
  className: string;
  height: string;
  liftDelay: number;
  liftDuration: number;
  revealDelay: number;
};

const metadata: [PodiumMetadata, PodiumMetadata, PodiumMetadata] = [
  {
    // first place
    className: "order-1 from-yellow-500 to-yellow-600",
    height: "20rem",
    liftDelay: 6,
    liftDuration: 0.6,
    revealDelay: 0.5,
  },
  {
    // second place
    className: "order-0 from-gray-400 to-gray-500",
    height: "15rem",
    liftDelay: 4,
    liftDuration: 0.6,
    revealDelay: 0.5,
  },
  {
    // third place
    className: "order-2 from-orange-800 to-orange-900",
    height: "10rem",
    liftDelay: 2,
    liftDuration: 0.6,
    revealDelay: 0.5,
  },
];

export default function ParticipantPodium() {
  const match = useMatchStore((state) => state.match);

  const popSound = useSound("pop.mp3");
  const trumpetSound = useSound("trumpet.mp3");

  return (
    <Container className="flex h-[28rem] items-end justify-center gap-10 p-10">
      {match.participants.slice(0, 3).map((participant, index) => {
        const meta = metadata[index];

        if (!meta) throw new Error("Invalid podium metadata.");

        return (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: meta.height }}
            transition={{
              delay: meta.liftDelay,
              duration: meta.liftDuration,
              type: "spring",
            }}
            onAnimationComplete={() => (index === 0 ? trumpetSound() : popSound())}
            key={participant.id}
            className={cn("w-[13rem] rounded-t-3xl bg-gradient-to-b text-white", meta.className)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: meta.liftDelay + meta.liftDuration,
                duration: meta.revealDelay,
                type: "spring",
              }}
              className="-mt-16 flex flex-col items-center justify-start gap-3"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: meta.liftDelay + meta.liftDuration,
                  duration: meta.revealDelay,
                  type: "spring",
                }}
              >
                <Image
                  src={getAvatarUrl(participant)}
                  alt={participant.nickname}
                  width={100}
                  height={100}
                  className="rounded-full drop-shadow-lg"
                />
              </motion.div>
              <span className="rounded-lg bg-background px-3 py-2 text-xl font-black text-foreground">
                {participant.nickname}
              </span>
              <span className="text-lg font-bold">
                {participant.totalPoints.toLocaleString("pt-BR")}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </Container>
  );
}
