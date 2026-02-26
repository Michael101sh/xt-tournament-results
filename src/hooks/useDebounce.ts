import { useEffect, useState } from "react";

// Delays propagation of rapidly-changing values (e.g., search input)
// to avoid firing a network request on every keystroke.
export const useDebounce = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
};
