import { useCallback, useEffect, useRef } from "react";

export function useSound(filename: string) {
  return useCallback(() => {
    const audio = new Audio(`/sounds/${filename}`);
    audio.play().catch((_) => {
      // Ignore errors, such as when the user has not interacted with the page yet
    });
  }, [filename]);
}

export function useIsFirstRender() {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  return isFirstRender.current;
}
