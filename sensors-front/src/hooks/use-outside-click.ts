import { RefObject, useCallback, useEffect } from "react";

export function useOutsideClick(
  ref: RefObject<HTMLDivElement>,
  handler: () => void
) {
  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;
      if (!target || !ref.current) return;
      if (!ref.current.contains(target)) {
        handler();
      }
    },
    [ref]
  );

  useEffect(() => {
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);
}
