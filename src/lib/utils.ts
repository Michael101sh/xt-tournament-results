import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind classes with conflict resolution (e.g., "px-2 px-4" → "px-4")
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
