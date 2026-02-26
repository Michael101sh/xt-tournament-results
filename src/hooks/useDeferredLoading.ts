import { useEffect, useState } from "react";

/**
 * Returns `true` only after `isLoading` has been `true` for at least `delayMs`.
 * Resets immediately when `isLoading` becomes `false`.
 */
export const useDeferredLoading = (isLoading: boolean, delayMs = 100): boolean => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }

    const id = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(id);
  }, [isLoading, delayMs]);

  return show;
};
