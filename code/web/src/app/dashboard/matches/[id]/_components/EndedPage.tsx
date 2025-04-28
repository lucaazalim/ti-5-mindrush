import BackButton from "~/app/dashboard/_components/BackButton";
import Container from "~/app/dashboard/_components/Container";
import Main from "~/app/dashboard/_components/Main";
import { useMatchStore } from "../_store/store-provider";
import ListLeaderboard from "./ListLeaderboard";
import PodiumLeaderboard from "./PodiumLeaderboard";
import QuizDescription from "./QuizDescription";

export default function EndedPage() {
  const match = useMatchStore((state) => state.match);
  const hadParticipants = match.participants.length > 0;

  return (
    <Main className="space-y-5 px-16 py-12">
      <BackButton />
      <QuizDescription />
      {hadParticipants ? (
        <>
          <PodiumLeaderboard />
          <ListLeaderboard />
        </>
      ) : (
        <Container>
          <h1 className="p-5 text-center text-xl font-medium drop-shadow-md">
            Não houve participantes nesta partida.
          </h1>
        </Container>
      )}
    </Main>
  );
}
