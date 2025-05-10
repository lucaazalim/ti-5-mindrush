import { fail, isFailure, isSuccess, succeed } from "~/lib/result";

describe("Result", () => {
  describe("succeed", () => {
    it("should return a Success object with data", () => {
      const result = succeed(42);
      expect(result).toEqual({ _tag: "Success", data: 42 });
    });

    it("should handle undefined data", () => {
      const result = succeed<number>(undefined);
      expect(result).toEqual({ _tag: "Success", data: undefined });
    });
  });

  describe("fail", () => {
    it("should return a Failure object with error", () => {
      const error = new Error("Something went wrong");
      const result = fail(error);
      expect(result).toEqual({ _tag: "Failure", error });
    });
  });

  describe("isSuccess", () => {
    it("should return true for Success", () => {
      const result = succeed("ok");
      expect(isSuccess(result)).toBe(true);
    });

    it("should return false for Failure", () => {
      const result = fail("error");
      expect(isSuccess(result)).toBe(false);
    });
  });

  describe("isFailure", () => {
    it("should return true for Failure", () => {
      const result = fail("error");
      expect(isFailure(result)).toBe(true);
    });

    it("should return false for Success", () => {
      const result = succeed("ok");
      expect(isFailure(result)).toBe(false);
    });
  });
});
