import { Uuid } from "~/lib/parsers";
import { Match, PopulatedMatch } from "../../lib/types";
import {
  calculatePoints,
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

describe("calculatePoints", () => {
  test("returns 0 for incorrect answers", () => {
    const points = calculatePoints(false, 10000, 5000, 0, 10);
    expect(points).toBe(0);
  });

  test("returns maximum points for immediate correct answer with no prior correct answers", () => {
    const points = calculatePoints(true, 10000, 0, 0, 10);
    expect(points).toBe(1000);
  });

  test("returns 550 points for immediate answer when all others have already answered correctly", () => {
    const points = calculatePoints(true, 10000, 0, 9, 10);
    expect(points).toBe(550);
  });

  test("returns 500 points for answer at the last moment with no prior correct answers", () => {
    const points = calculatePoints(true, 10000, 10000, 0, 10);
    expect(points).toBe(500);
  });

  test("returns 500 points for answers in the middle of time with half of participants already answered", () => {
    const points = calculatePoints(true, 10000, 5000, 5, 10);
    expect(points).toBe(500);
  });

  test("calculates correct points when no other participants exist", () => {
    const points = calculatePoints(true, 10000, 5000, 0, 1);
    expect(points).toBe(750);
  });

  test("returns rounded points value", () => {
    // Using specific values that would result in a fraction
    const points = calculatePoints(true, 10000, 3333, 3, 10);
    // Expect a whole number (rounded value)
    expect(points).toBe(Math.round(points));
  });

  test("ensures points never exceed 1000", () => {
    // Test with values that might cause overflow
    const points = calculatePoints(true, 1, 0, 0, 100);
    expect(points).toBeLessThanOrEqual(1000);
  });

  test("ensures points are never negative", () => {
    // Test with extreme values that might cause negative results
    const points = calculatePoints(true, 10, 100, 1000, 10);
    expect(points).toBeGreaterThanOrEqual(0);
  });
});
