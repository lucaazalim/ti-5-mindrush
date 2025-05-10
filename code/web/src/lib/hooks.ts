import { useCallback, useEffect, useRef } from "react";

/**
 * Plays a sound file.
 *
 * @param filename The name of the sound file to play.
 * @returns A callback function that plays the sound when invoked.
 */
export function useSound(filename: string) {
  return useCallback(() => {
    const audio = new Audio(`/sounds/${filename}`);
    audio.play().catch((_) => {
      // Ignore errors, such as when the user has not interacted with the page yet
    });
  }, [filename]);
}

/**
 * Determines if the current render is the first render.
 *
 * @returns True if it is the first render, false otherwise.
 */
export function useIsFirstRender() {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  return isFirstRender.current;
}
