import { renderHook, act } from "@testing-library/react";
import { useSound, useIsFirstRender } from "../../lib/hooks";

describe("useSound", () => {
  it("should play the sound file when invoked", () => {
    const playMock = jest.fn().mockResolvedValue(undefined);
    global.Audio = jest.fn().mockImplementation(() => ({
      play: playMock,
    }));

    const { result } = renderHook(() => useSound("test.mp3"));

    act(() => {
      result.current();
    });

    expect(global.Audio).toHaveBeenCalledWith("/sounds/test.mp3");
    expect(playMock).toHaveBeenCalled();
  });
});

describe("useIsFirstRender", () => {
  it("should return true on the first render", () => {
    const { result } = renderHook(() => useIsFirstRender());
    expect(result.current).toBe(true);
  });

  it("should return false on subsequent renders", () => {
    const { result, rerender } = renderHook(() => useIsFirstRender());

    act(() => {
      rerender();
    });

    expect(result.current).toBe(false);
  });
});