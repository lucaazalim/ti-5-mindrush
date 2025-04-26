import { useMatchStore } from "../_store/store-provider";

export default function PartialRanking() {
  const match = useMatchStore((state) => state.match);

  if (!match.currentQuestion) {
    throw new Error("No current question");
  }

  return (
    <>
      {match.currentQuestion?.alternatives.map((alternative) => (
        <p key={alternative.id}>{alternative.count}</p>
      ))}
    </>
  );
}
