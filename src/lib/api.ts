import type { Player, PlayersQueryParams, PlayersResponse } from "../types/player";

const API_BASE = "/api/v1";

export const fetchPlayers = async (
  params: PlayersQueryParams,
  signal?: AbortSignal,
): Promise<PlayersResponse> => {
  const url = new URL(`${API_BASE}/players`, window.location.origin);
  url.searchParams.set("start", String(params.start));
  url.searchParams.set("n", String(params.n));
  if (params.level) url.searchParams.set("level", params.level);
  if (params.search) url.searchParams.set("search", params.search);

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch players: ${response.status}`);
  }

  const players: Player[] = await response.json();
  const total = Number(response.headers.get("x-total") ?? 0);

  return { players, total };
};

export const fetchSuspects = async (): Promise<number[]> => {
  const response = await fetch(`${API_BASE}/players/suspects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch suspects: ${response.status}`);
  }

  return response.json();
};
