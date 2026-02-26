// Mirrors the JSON shape returned by GET /api/v1/players
export interface Player {
  id: number;
  name: string;
  level: "rookie" | "amateur" | "pro";
  score: number;
}

export type PlayerLevel = Player["level"];

// Enriched response — total comes from the x-total response header
export interface PlayersResponse {
  players: Player[];
  total: number;
}

export interface PlayersQueryParams {
  start: number;
  n: number;
  level?: PlayerLevel;
  search?: string;
}
