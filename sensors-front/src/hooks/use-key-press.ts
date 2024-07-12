import { useCallback, useEffect } from "react";

export function useKeyPress(key: string, handler: () => void) {
  const onKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === key) {
      handler();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, []);
}
