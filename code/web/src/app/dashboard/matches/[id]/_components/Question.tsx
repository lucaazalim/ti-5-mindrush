import { ReactTyped } from "react-typed";
import { QUESTION_VISUALS } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { useMatchStore } from "../_store/store-provider";

export default function Question() {
  const match = useMatchStore((state) => state.match);

  const { currentQuestion } = match;

  if (!currentQuestion) {
    throw new Error("Match is running but there no current question. How did this happen?");
  }

  return (
    <>
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
          const { icon: Icon, colorClassName: color } = QUESTION_VISUALS[index]!;

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
    </>
  );
}
