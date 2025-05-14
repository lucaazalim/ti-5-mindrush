import { describe, expect, it } from "@jest/globals";
import {
  isMatchPin,
  isParticipantNickname,
  isUuid,
  quizWithQuestionsAndAlternativesParser,
  updateQuizParser,
} from "../../lib/parsers";

// UUID Tests
describe("uuidParser", () => {
  it("should validate a correct UUID", () => {
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    expect(isUuid(validUuid)).toBe(true);
  });

  it("should invalidate an incorrect UUID", () => {
    const invalidUuid = "invalid-uuid";
    expect(isUuid(invalidUuid)).toBe(false);
  });
});

// UpdateQuiz Tests
describe("updateQuizParser", () => {
  it("should validate a correct updateQuiz object", () => {
    const validQuiz = { title: "New Quiz", description: "This is a valid description." };
    expect(() => updateQuizParser.parse(validQuiz)).not.toThrow();
  });

  it("should invalidate an incorrect updateQuiz object", () => {
    const invalidQuiz = { title: "No", description: "Short" };
    expect(() => updateQuizParser.parse(invalidQuiz)).toThrow();
  });
});

// QuestionAndAlternatives Tests
describe("questionAndAlternativesParser", () => {
  it("should validate a correct question object", () => {
    const validQuestion = {
      quizId: "123e4567-e89b-12d3-a456-426614174000",
      questions: [
        {
          id: "123e4567-e89b-12d3-a456-426614174001",
          question: "What is 2 + 2?",
          type: "QUIZ",
          timeLimit: 30,
          order: 1,
          image: null,
          alternatives: ["1", "2", "3", "4"],
          correctAlternativeIndex: 3,
        },
      ],
    };
    expect(() => quizWithQuestionsAndAlternativesParser.parse(validQuestion)).not.toThrow();
  });

  it("should invalidate an incorrect question object", () => {
    const invalidQuestion = {
      quizId: "invalid-uuid",
      questions: [
        {
          question: "What is 2 + 2?",
          type: "QUIZ",
          timeLimit: 200,
          order: 1,
          alternatives: ["1", "2", "3", "4"],
          correctAlternativeIndex: 5,
        },
      ],
    };
    expect(() => quizWithQuestionsAndAlternativesParser.parse(invalidQuestion)).toThrow();
  });
});

// ParticipantNickname Tests
describe("participantNicknameParser", () => {
  it("should validate a correct nickname", () => {
    const validNickname = "John123";
    expect(isParticipantNickname(validNickname)).toBe(true);
  });

  it("should invalidate an incorrect nickname", () => {
    const invalidNickname = "@Invalid!";
    expect(isParticipantNickname(invalidNickname)).toBe(false);
  });
});

// MatchPin Tests
describe("matchPinParser", () => {
  it("should validate a correct match pin", () => {
    const validPin = "123456";
    expect(isMatchPin(validPin)).toBe(true);
  });

  it("should invalidate an incorrect match pin", () => {
    const invalidPin = "12345";
    expect(isMatchPin(invalidPin)).toBe(false);
  });
});
