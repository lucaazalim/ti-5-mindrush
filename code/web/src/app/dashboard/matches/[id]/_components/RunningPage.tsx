import { useMatchStore } from "../_store/store-provider";
import { EndMatchButton } from "./buttons/EndMatchButton";
import { NextQuestionButton } from "./buttons/NextQuestionButton";

export default function RunningPage() {
  const match = useMatchStore((state) => state.match);
  const setMatch = useMatchStore((state) => state.setMatch);

  const { currentQuestion } = match;

  if (!currentQuestion) {
    throw new Error("Match is running but there no current question. How did this happen?");
  }

  return (
    <div className="flex flex-col justify-center gap-3">
      <h1>{currentQuestion.question}</h1>
      {currentQuestion.image && <img src={currentQuestion.image} alt="Imagem da questão" />}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.alternatives.map((alternative) => (
          <div key={alternative.id} className="border-2 p-3 text-center">
            {alternative.answer}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NextQuestionButton />
        <EndMatchButton />
      </div>
    </div>
  );
}
