import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPlayers } from "../dal/api";
import type { PlayerLevel } from "../types/player";

// Wraps TanStack Query for paginated player fetching with server-side filtering.
// keepPreviousData prevents the table from flashing empty between page transitions.
export const usePlayersQuery = (
  page: number,
  pageSize: number,
  level?: PlayerLevel,
  search?: string,
) => {
  // Normalize before query key so "Alice" and "alice" share the same cache entry
  const normalized = search?.trim().toLowerCase() || undefined;
  return useQuery({
    queryKey: ["players", page, pageSize, level, normalized],
    queryFn: ({ signal }) =>
      fetchPlayers(
        {
          start: page * pageSize,
          n: pageSize,
          level,
          search: normalized,
        },
        signal,
      ),
    placeholderData: keepPreviousData,
  });
};
