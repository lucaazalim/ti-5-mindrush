import { useMatchStore } from "../_store/store-provider";
import AlternativeStats from "./AlternativeStats";

export default function PartialSummary() {
  const match = useMatchStore((state) => state.match);

  if (!match.currentQuestion) {
    throw new Error("No current question");
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <AlternativeStats />
    </div>
  );
}
