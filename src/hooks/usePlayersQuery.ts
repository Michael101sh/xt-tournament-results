import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPlayers } from "../lib/api";
import type { PlayerLevel } from "../types/player";

export const usePlayersQuery = (
  page: number,
  pageSize: number,
  level?: PlayerLevel,
  search?: string,
) => {
  return useQuery({
    queryKey: ["players", page, pageSize, level, search],
    queryFn: () =>
      fetchPlayers({
        start: page * pageSize,
        n: pageSize,
        level,
        search: search || undefined,
      }),
    placeholderData: keepPreviousData,
  });
};
