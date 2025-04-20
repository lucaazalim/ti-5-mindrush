import { EyeOff } from "lucide-react";
import BackButton from "~/app/dashboard/_components/BackButton";

export default function EndedPage() {
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-3">
      <EyeOff className="h-20 w-20" />
      <h1 className="text-xl">Partida encerrada!</h1>
      <BackButton />
    </div>
  );
}
