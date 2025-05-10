import { Uuid } from "~/lib/parsers";
import { Match, PopulatedMatch } from "../../lib/types";
import {
  getAvatarUrl,
  getCurrentQuestionTimeLeft,
  getMatchChannel,
  hasCurrentQuestion,
  hasCurrentQuestionTimeEnded,
  hasNextQuestion,
} from "../../lib/utils";

describe("utils.ts", () => {
  test("getAvatarUrl generates correct URL", () => {
    const url = getAvatarUrl({ id: "12345" as Uuid });
    expect(url).toBe("https://api.dicebear.com/9.x/bottts/svg?seed=12345&textureProbability=0");
  });

  test("getMatchChannel generates correct channel name", () => {
    const channel = getMatchChannel({ id: "67890" as Uuid });
    expect(channel).toBe("presence-match-67890");
  });

  test("hasCurrentQuestionTimeEnded returns true if time has ended", () => {
    const match: Match = { currentQuestionEndsAt: new Date(Date.now() - 1000) } as Match;
    expect(hasCurrentQuestionTimeEnded(match)).toBe(true);
  });

  test("hasCurrentQuestionTimeEnded returns false if time has not ended", () => {
    const match: Match = { currentQuestionEndsAt: new Date(Date.now() + 1000) } as Match;
    expect(hasCurrentQuestionTimeEnded(match)).toBe(false);
  });

  test("getCurrentQuestionTimeLeft returns correct time left", () => {
    const match = {
      currentQuestionId: "1",
      currentQuestionStartedAt: new Date(),
      currentQuestionEndsAt: new Date(Date.now() + 5000),
    } as Match;
    expect(getCurrentQuestionTimeLeft(match)).toBeGreaterThan(0);
  });

  test("hasNextQuestion returns true if there is a next question", () => {
    const populatedMatch: PopulatedMatch = {
      currentQuestionId: "1",
      quiz: { questions: [{ id: "1" }, { id: "2" }] },
    } as PopulatedMatch;
    expect(hasNextQuestion(populatedMatch)).toBe(true);
  });

  test("hasNextQuestion returns false if there is no next question", () => {
    const populatedMatch: PopulatedMatch = {
      currentQuestionId: "2",
      quiz: { questions: [{ id: "1" }, { id: "2" }] },
    } as PopulatedMatch;
    expect(hasNextQuestion(populatedMatch)).toBe(false);
  });

  test("hasCurrentQuestion returns true if all fields are defined", () => {
    expect(
      hasCurrentQuestion({
        currentQuestionId: "1" as Uuid,
        currentQuestionStartedAt: new Date(),
        currentQuestionEndsAt: new Date(Date.now() + 5000),
      }),
    ).toBe(true);
  });

  test("hasCurrentQuestion returns false if any field is undefined", () => {
    expect(
      hasCurrentQuestion({
        currentQuestionId: "1" as Uuid,
        currentQuestionStartedAt: null,
        currentQuestionEndsAt: new Date(Date.now() + 5000),
      }),
    ).toBe(false);
  });
});
